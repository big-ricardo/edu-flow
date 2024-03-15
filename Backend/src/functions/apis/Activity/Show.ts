import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Activity, { IActivityAccepted } from "../../../models/Activity";
import Answer from "../../../models/Answer";
import FormDraft, { FieldTypes, IField } from "../../../models/FormDraft";
import User from "../../../models/User";
import mongoose from "mongoose";

const usersCache = new Map<
  string,
  {
    _id: string;
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
  answer: {
    [key: string]: string;
  }
) => {
  const extraFields = [];

  for (const field of fields) {
    const value = answer[field.id];

    if (field.predefined === FieldTypes.Teachers && value) {
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

  const activity = (
    await new Activity(conn)
      .model()
      .findById(id)
      .populate("users", {
        _id: 1,
        name: 1,
        matriculation: 1,
        email: 1,
      })
      .populate("masterminds.user", {
        _id: 1,
        name: 1,
        matriculation: 1,
        email: 1,
      })
      .populate("sub_masterminds.user", {
        _id: 1,
        name: 1,
        matriculation: 1,
        email: 1,
      })
      .populate("status", {
        _id: 1,
        name: 1,
      })
  ).toObject();

  if (!activity) {
    return res.notFound("Activity not found");
  }

  const [answer] = await new Answer(conn)
    .model()
    .find({ activity: id })
    .limit(1)
    .sort({ createdAt: 1 });

  const formDraft = (
    await new FormDraft(conn).model().findById(answer.form_draft).exec()
  ).toObject();

  const extraFields = await formatExtraFields(
    conn,
    formDraft.fields,
    answer.data
  );

  if (!activity.masterminds?.length) {
    const masterminds = await Promise.all(
      extraFields.map(async (field) => {
        if (field.id === "{{activity_mastermind}}") {
          return getUser(conn, field.value);
        }

        return null;
      })
    );

    activity.masterminds = masterminds.reduce((acc, mastermind) => {
      if (mastermind) {
        acc.push({
          accepted: IActivityAccepted.pending,
          user: mastermind,
        });
      }

      return acc;
    }, []);
  }

  if (!activity.sub_masterminds?.length) {
    const subMasterminds = await Promise.all(
      extraFields.map(async (field) => {
        if (field.id === "{{activity_submastermind}}") {
          return getUser(conn, field.value);
        }

        return null;
      })
    );

    activity.sub_masterminds = subMasterminds.reduce((acc, subMastermind) => {
      if (subMastermind) {
        acc.push(subMastermind);
      }

      return acc;
    }, []);
  }

  return res.success({
    ...activity,
    extra_fields: {
      ...answer.toObject(),
      form_draft: {
        _id: formDraft._id,
        fields: extraFields,
      },
    },
  });
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
