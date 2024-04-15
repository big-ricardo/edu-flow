import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Activity, {
  IActivity,
  IActivityAccepted,
} from "../../../models/Activity";
import Answer, { IAnswer } from "../../../models/Answer";
import FormDraft, { FieldTypes, IField } from "../../../models/FormDraft";
import User from "../../../models/User";
import mongoose, { ObjectId } from "mongoose";
import { updateSas } from "../../../services/upload";

const usersCache = new Map<
  string,
  {
    _id: ObjectId;
    name: string;
    matriculation: string;
    email: string;
  }
>();

const getUser = async (conn, id: string) => {
  if (usersCache.has(id)) {
    return usersCache.get(id);
  }

  const user = await new User(conn).model().findById(id).select({
    _id: 1,
    name: 1,
    matriculation: 1,
    email: 1,
  });
  if (!user) {
    return null;
  }

  const userObject = user.toObject();

  usersCache.set(id, userObject);

  return userObject;
};

const formatExtraFields = async (
  conn: mongoose.Connection,
  fields: IField[],
  answer: IAnswer["data"]
) => {
  const extraFields = [];

  for (const field of fields) {
    const value = answer[field.id];

    if (typeof value === "object" && "mimeType" in value) {
      extraFields.push({
        ...field,
        value: await updateSas(value),
      });

      continue;
    }

    if (field.type === FieldTypes.Teacher && value) {
      const user = await getUser(conn, value);
      extraFields.push({
        ...field,
        value: user ?? value,
      });

      continue;
    }

    extraFields.push({
      ...field,
      value,
    });
  }

  return extraFields;
};

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params as { id: string };

  const activity = await new Activity(conn).model().findById(id);

  if (!activity) {
    return res.notFound("Activity not found");
  }

  if (!activity.sub_masterminds?.length) {
    activity.sub_masterminds =
      activity.form_draft.fields.find((form) => form.id === "submastermind")
        ?.value ?? [];
  }

  return res.success(activity);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    params: schema.object({
      id: schema.string().required(),
    }),
  }))
  .configure({
    name: "ActivityShow",
    options: {
      methods: ["GET"],
      route: "activity/{id}",
    },
  });
