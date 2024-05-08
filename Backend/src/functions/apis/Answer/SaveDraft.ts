import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import { FieldTypes, IValue } from "../../../models/client/FormDraft";
import uploadFileToBlob from "../../../services/upload";
import User from "../../../models/client/User";
import { ObjectId, Types } from "mongoose";
import {
  extraOutputsEvaluationProcess,
  sendToQueue,
} from "../../../utils/sbusOutputs";
import FormRepository from "../../../repositories/Form";
import FormDraftRepository from "../../../repositories/FormDraft";
import ActivityRepository from "../../../repositories/Activity";
import { IFormType } from "../../../models/client/Form";
import { IActivityStepStatus } from "../../../models/client/Activity";
import ResponseUseCases from "../../use-cases/Response";
import UserRepository from "../../../repositories/User";
import BlobUploader from "../../../services/upload";
import AnswerRepository from "../../../repositories/Answer";

interface File {
  name: string;
  mimeType: string;
  base64: string;
}

interface IUser {
  _id?: ObjectId;
  name: string;
  email: string;
}

type DtoCreated = {} & {
  [key: string]: File | string | Array<string> | IUser | Array<IUser>;
};

const handler: HttpHandler = async (conn, req, context) => {
  const rest = req.body as DtoCreated;

  const formRepository = new FormRepository(conn);
  const formDraftRepository = new FormDraftRepository(conn);
  const userRepository = new UserRepository(conn);

  const form = (
    await formRepository.findOpenForms({
      where: {
        _id: req.params.form_id,
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

  const answer = formDraft.fields.reduce((acc, field) => {
    return {
      ...acc,
      [field.id]: field.value ?? undefined,
    };
  }, {});

  console.log(answer);

  const answerRepository = new AnswerRepository(conn);

  const existDraft = (
    await answerRepository.find({
      where: {
        user: req.user.id,
        form: form._id,
        submitted: false,
      },
    })
  ).at(0);

  if (existDraft) {
    existDraft.data = answer;

    await existDraft.save();
  } else {
    await answerRepository.create({
      user: req.user.id,
      form: form._id,
      data: answer,
    });
  }

  return res.created(answer);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    params: schema.object().shape({
      form_id: schema.string().required(),
    }),
    body: schema.object().shape({}),
  }))
  .configure({
    name: "AnswerDraftSave",
    options: {
      methods: ["POST"],
      route: "form/{form_id}/answer",
    },
  });
