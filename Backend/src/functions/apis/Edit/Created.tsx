import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import {
  IActivityState,
} from "../../../models/client/Activity";
import { ObjectId } from "mongoose";
import ActivityRepository from "../../../repositories/Activity";
import UserRepository from "../../../repositories/User";
import ResponseUseCases from "../../../use-cases/Response";
import BlobUploader from "../../../services/upload";

interface File {
  name: string;
  mimeType: string;
  base64: string;
}

interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
}

type DtoCreated = {
  name: string; // "name"
  description: string; // "description"
} & {
  [key: string]: File | string | Array<string> | IUser | Array<IUser>;
};

const handler: HttpHandler = async (conn, req) => {
  const rest = req.body as DtoCreated;
  const { name, description } = rest;

  const activityRepository = new ActivityRepository(conn);
  const userRepository = new UserRepository(conn);

  const activity = await activityRepository.findById({
    id: req.params.activity_id,
  });

  if (!activity) {
    return res.notFound("Form not found");
  }

  const formDraft = activity.form_draft;

  if (!formDraft) {
    return res.notFound("Form draft not found");
  }

  const responseUseCases = new ResponseUseCases(
    formDraft,
    new BlobUploader(req.user.id),
    userRepository
  );

  await responseUseCases.processFormFields(rest);

  activity.name = name;
  activity.description = description;
  activity.state = IActivityState.created;
  activity.form_draft = formDraft;

  activity.save();

  return res.created(activity);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    params: schema.object().shape({
      activity_id: schema.string().required(),
    }),
    body: schema.object().shape({
      name: schema.string().required().min(3).max(255),
      description: schema.string().required().min(3).max(255),
    }),
  }))
  .configure({
    name: "EditResponse",
    permission: "activity.update",
    options: {
      methods: ["POST"],
      route: "response/{activity_id}/edit",
    },
  });
