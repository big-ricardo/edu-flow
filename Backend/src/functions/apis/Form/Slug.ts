import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Form from "../../../models/Form";
import moment from "moment";
import User from "../../../models/User";
import Institute from "../../../models/Institute";
import FormDraft from "../../../models/FormDraft";

const predefinedValues = {
  teachers: null,
  students: null,
  institution: null,
};

const getPredefinedValues = async (
  conn: Parameters<HttpHandler>[0],
  value: "teachers" | "students" | "institution"
) => {
  if (value === "institution") {
    predefinedValues[value] = (await new Institute(conn).model().find()).map(
      (user) => ({
        label: user.name,
        value: user._id,
      })
    );
    return;
  }

  const users = await new User(conn).model().find({
    role: value === "teachers" ? "teacher" : "student",
  });

  predefinedValues[value] = users.map((user) => ({
    label: user.name,
    value: user._id,
  }));
};

const handler: HttpHandler = async (conn, req) => {
  const { slug } = req.params as { slug: string };

  const form = await new Form(conn).model().findOne({
    slug,
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
  });

  const formDraft = await new FormDraft(conn).model().findById(form?.published);

  for (const field of formDraft.fields) {
    if (field?.predefined) {
      if (!predefinedValues?.[field.predefined]?.length) {
        await getPredefinedValues(conn, field?.predefined);
      }

      field.options = predefinedValues[field.predefined];
    }
  }

  if (!form) {
    return res.notFound("Form not found");
  }

  return res.success({
    ...form,
    fields: formDraft.fields,
  });
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    params: schema.object({
      slug: schema.string().required(),
    }),
  }))
  .configure({
    name: "FormSlug",
    options: {
      methods: ["GET"],
      route: "form/slug/{slug}",
    },
  });
