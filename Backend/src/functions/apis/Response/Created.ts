import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Activity from "../../../models/Activity";
import Form from "../../../models/Form";
import Answer from "../../../models/Answer";
import FormDraft from "../../../models/FormDraft";
import moment from "moment";

interface DtoCreated {
  "{{activity_name}}": string; // "name"
  "{{activity_description}}": string; // "description"
  [key: string]:
    | string
    | {
        file: string;
      };
}

const handler: HttpHandler = async (conn, req) => {
  const {
    "{{activity_name}}": name,
    "{{activity_description}}": description,
    ...rest
  } = req.body as DtoCreated;

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

  const formDraft = await new FormDraft(conn).model().exists({
    _id: form.published,
  });

  if (!formDraft) {
    return res.notFound("Form draft not found");
  }

  const activity = await new Activity(conn).model().create({
    name,
    description,
    form: form._id,
    status: form.initial_status,
    users: [req.user.id],
  });

  await new Answer(conn).model().create({
    user: req.user.id,
    activity: activity._id,
    form_draft: formDraft._id,
    data: {
      ...rest,
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
      "{{activity_name}}": schema.string().required().min(3).max(255),
      "{{activity_description}}": schema.string().required().min(3).max(255),
    }),
  }))
  .configure({
    name: "ResponseCreated",
    options: {
      methods: ["POST"],
      route: "response/{form_id}/created",
    },
  });
