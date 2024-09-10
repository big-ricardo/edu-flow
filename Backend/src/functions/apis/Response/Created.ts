import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import { IActivityAccepted } from "../../../models/client/Activity";
import { IFormType } from "../../../models/client/Form";
import Status from "../../../models/client/Status";
import { ObjectId } from "mongoose";
import FormRepository from "../../../repositories/Form";
import FormDraftRepository from "../../../repositories/FormDraft";
import UserRepository from "../../../repositories/User";
import ActivityRepository from "../../../repositories/Activity";
import BlobUploader from "../../../services/upload";
import AnswerRepository from "../../../repositories/Answer";
import ResponseUseCases from "../../../use-cases/Response";

interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
}

type DtoCreated = {
  name: string; // "name"
  description: string; // "description"
  masterminds:
    | Pick<IUser, "_id" | "name" | "email">
    | Array<Pick<IUser, "_id" | "name" | "email">>;
} & {
  [key: string]: File | string | Array<string> | IUser | Array<IUser>;
};

const handler: HttpHandler = async (conn, req) => {
  const rest = req.body as DtoCreated;
  const { name, description, masterminds } = rest;

  const formRepository = new FormRepository(conn);
  const formDraftRepository = new FormDraftRepository(conn);
  const userRepository = new UserRepository(conn);
  const activityRepository = new ActivityRepository(conn);

  const form = (
    await formRepository.findOpenForms({
      where: {
        _id: req.params.form_id,
        type: IFormType.Created,
      },
    })
  )[0];

  if (!form) {
    return res.notFound("Form not found");
  }

  console.log(JSON.stringify(form, null, 2));

  if (form.pre_requisites?.form && form.pre_requisites?.status) {
    const exist = await activityRepository.findOne({
      where: {
        form: form.pre_requisites.form,
        status: form.pre_requisites.status,
        "users._id": req.user.id,
      },
      select: {
        _id: 1,
      },
    });

    console.log("exist", !!exist);

    if (!exist) {
      return res.badRequest(
        "You don't have permission to create this activity because you don't have the necessary prerequisites"
      );
    }
  }

  const formDraft = await formDraftRepository.findById({ id: form.published });

  if (!formDraft) {
    return res.notFound("Form draft not found");
  }

  const responseUseCases = new ResponseUseCases(
    formDraft,
    new BlobUploader(req.user.id),
    userRepository
  );

  const mastermindsMapped = responseUseCases.getMastermindsMapped(masterminds);

  const mastermindsExists = await userRepository.find({
    where: {
      _id: {
        $in: mastermindsMapped,
      },
    },
    select: {
      _id: 1,
      name: 1,
      email: 1,
      matriculation: 1,
      university_degree: 1,
      institute: 1,
    },
  });

  await responseUseCases.processFormFields(rest);

  const status = await new Status(conn).model().findById(form.initial_status);

  const user = await userRepository.findById({
    id: req.user.id,
    select: {
      _id: 1,
      name: 1,
      email: 1,
      matriculation: 1,
      university_degree: 1,
      institute: 1,
    },
  });

  const activity = await activityRepository.create({
    name,
    description,
    form: String(form._id),
    status: status.toObject(),
    users: [user.toObject()],
    masterminds: mastermindsExists?.map((mastermind) => ({
      user: mastermind.toObject(),
      accepted: IActivityAccepted.pending,
    })),
    form_draft: formDraft.toObject(),
  });

  const answerRepository = new AnswerRepository(conn);

  await answerRepository.updateMany({
    where: {
      form: form._id,
      user: req.user.id,
      submitted: false,
    },
    data: {
      activity: activity._id,
      submitted: true,
    },
  });

  return res.created(activity);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    params: schema.object().shape({
      form_id: schema.string().required(),
    }),
    body: schema.object().shape({
      name: schema.string().required().min(3).max(255),
      description: schema.string().required().min(3).max(255),
    }),
  }))
  .configure({
    name: "ResponseCreated",
    permission: "response.create",
    options: {
      methods: ["POST"],
      route: "response/{form_id}/created",
    },
  });
