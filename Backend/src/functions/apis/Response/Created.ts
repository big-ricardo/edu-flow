import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
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
  description: string; // "description"
} & {
  [key: string]: File | string | Array<string> | IUser | Array<IUser>;
};

const handler: HttpHandler = async (conn, req) => {
  const rest = req.body as DtoCreated;
  const { description } = rest;

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

  const formDraft = await formDraftRepository.findById({ id: form.published });

  if (!formDraft) {
    return res.notFound("Form draft not found");
  }

  const responseUseCases = new ResponseUseCases(
    formDraft,
    new BlobUploader(req.user.id),
    userRepository
  );

  await responseUseCases.processFormFields(rest);

  const status = await new Status(conn).model().findById(form.initial_status);

  const user = await userRepository.findById({
    id: req.user.id,
    select: {
      _id: 1,
      name: 1,
      email: 1,
      matriculation: 1,
      institute: 1,
    },
  });

  const activity = await activityRepository.create({
    name: form.name,
    description,
    form: String(form._id),
    status: status.toObject(),
    users: [user.toObject()],
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
