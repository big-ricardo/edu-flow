import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Activity, {
  IActivityAccepted,
  IActivityState,
  IActivityStepStatus,
} from "../../../models/client/Activity";
import Form from "../../../models/client/Form";
import FormDraft, {
  FieldTypes,
  IValue,
} from "../../../models/client/FormDraft";
import moment from "moment";
import uploadFileToBlob, { FileUploaded } from "../../../services/upload";
import User, { IUserRoles } from "../../../models/client/User";
import Status from "../../../models/client/Status";
import { ObjectId } from "mongoose";
import { Types } from "mongoose";
import { NodeTypes } from "../../../models/client/WorkflowDraft";
import { setHeapSnapshotNearHeapLimit } from "v8";
import ActivityRepository from "../../../repositories/Activity";
import UserRepository from "../../../repositories/User";
import ResponseUseCases from "../../use-cases/Response";
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
  masterminds: Pick<IUser, "_id" | "name" | "email">;
} & {
  [key: string]: File | string | Array<string> | IUser | Array<IUser>;
};

const handler: HttpHandler = async (conn, req) => {
  const rest = req.body as DtoCreated;
  const { name, description, masterminds } = rest;

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

  const mastermindsMapped = responseUseCases.getMastermindsMapped(masterminds);

  const mastermindsExists = await userRepository.find({
    where: {
      _id: {
        $in: mastermindsMapped.map((mastermind) => mastermind._id),
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
  
  activity.name = name;
  activity.description = description;
  activity.masterminds = mastermindsExists?.map((mastermind) => ({
    user: mastermind.toObject(),
    accepted: IActivityAccepted.pending,
  }));
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
    options: {
      methods: ["POST"],
      route: "response/{activity_id}/edit",
    },
  });
