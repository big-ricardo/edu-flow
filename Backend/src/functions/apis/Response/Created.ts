import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Activity, {
  IActivityAccepted,
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

  const form = await new Form(conn)
    .model()
    .findOne({
      _id: req.params.form_id,
      active: true,
      published: { $exists: true },
      $and: [
        {
          $or: [
            {
              "period.open": {
                $exists: false,
              },
            },
            {
              "period.open": {
                $lte: moment.utc().toDate(),
              },
            },
          ],
        },
        {
          "period.close": {
            $gte: moment.utc().toDate(),
          },
        },
      ],
    })
    .select({
      initial_status: 1,
      published: 1,
    });

  if (!form) {
    return res.notFound("Form not found");
  }

  const formDraft = await new FormDraft(conn).model().findById(form.published);

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
          if (val?._id) {
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

  const status = await new Status(conn).model().findById(form.initial_status);

  const user = await new User(conn).model().findById(req.user.id).select({
    _id: 1,
    name: 1,
    email: 1,
    matriculation: 1,
    university_degree: 1,
    institute: 1,
  });

  const activity = await new Activity(conn).model().create({
    name,
    description,
    form: form._id,
    status: status.toObject(),
    users: [user.toObject()],
    masterminds: mastermindsExists?.map((mastermind) => ({
      user: mastermind.toObject(),
      accepted: IActivityAccepted.pending,
    })),
    form_draft: formDraft.toObject(),
  });

  await new User(conn).model().findByIdAndUpdate(req.user.id, {
    $push: {
      activities: activity._id,
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
    options: {
      methods: ["POST"],
      route: "response/{form_id}/created",
    },
  });
