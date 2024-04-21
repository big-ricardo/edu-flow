import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Activity, {
  IActivityAccepted,
  IActivityState,
  IActivityStepStatus,
} from "../../../models/client/Activity";
import Form from "../../../models/client/Form";
import FormDraft, { FieldTypes, IValue } from "../../../models/client/FormDraft";
import moment from "moment";
import uploadFileToBlob, { FileUploaded } from "../../../services/upload";
import User, { IUserRoles } from "../../../models/client/User";
import Status from "../../../models/client/Status";
import { ObjectId } from "mongoose";
import { Types } from "mongoose";
import { NodeTypes } from "../../../models/client/WorkflowDraft";
import { setHeapSnapshotNearHeapLimit } from "v8";

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

  const activity = await new Activity(conn)
    .model()
    .findById(req.params.activity_id);

  if (!activity) {
    return res.notFound("Form not found");
  }

  const formDraft = activity.form_draft;

  if (!formDraft) {
    return res.notFound("Form draft not found");
  }

  const mastermindsMapped = Array.isArray(masterminds)
    ? masterminds
    : [masterminds];

  const mastermindsExists = await new User(conn)
    .model()
    .find({
      _id: {
        $in: mastermindsMapped,
      },
    })
    .select({
      _id: 1,
      name: 1,
      email: 1,
      matriculation: 1,
      university_degree: 1,
      institute: 1,
    });

  for (const field of formDraft.fields) {
    let value = rest[field.id];
    let mapped: IValue = null;

    if (!value || (Array.isArray(value) && !value.length)) {
      field.value = value;
      continue;
    }

    if (field.type === FieldTypes.File && typeof value === "object") {
      const file: File = value as File;

      const uploaded = await uploadFileToBlob(
        req.user.id,
        file?.name,
        file?.mimeType,
        file?.base64
      ).catch((err) => {
        throw err;
      });

      if (!uploaded) {
        return res.badRequest("Error on upload file");
      }

      mapped = "file";
    }

    if (field.type === FieldTypes.Teacher && Array.isArray(value)) {
      const teachers = await new User(conn)
        .model()
        .find({
          _id: {
            $in: value.map((val) => val?._id).filter((val) => val),
          },
        })
        .select({
          password: 0,
        });

      mapped = value.map((val) => {
        if (typeof val === "string") {
          return teachers.find((teacher) => String(teacher._id) === val);
        }

        if (typeof val === "object") {
          if (!val?.isExternal) {
            return teachers.find((teacher) => String(teacher._id) === val._id);
          }

          return {
            ...val,
            isExternal: true,
            _id: new Types.ObjectId(),
          };
        }
      });
    }

    field.value = mapped || value;
  }

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
