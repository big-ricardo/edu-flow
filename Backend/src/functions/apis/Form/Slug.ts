import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Form, { IForm } from "../../../models/Form";
import moment from "moment";
import User from "../../../models/User";
import Institute from "../../../models/Institute";
import FormDraft, { IFormDraft } from "../../../models/FormDraft";

const predefinedValues = {
  teachers: null,
  students: null,
  institution: null,
};

const getPredefinedValues = async (
  conn: Parameters<HttpHandler>[0],
  value: "teachers" | "students" | "institution"
) => {
  if (predefinedValues[value]) {
    return predefinedValues[value];
  }

  if (value === "institution") {
    predefinedValues[value] = (await new Institute(conn).model().find()).map(
      (user) => ({
        label: user.name,
        value: user._id,
      })
    );
    return predefinedValues[value];
  }

  predefinedValues[value] = await new User(conn).model().aggregate([
    {
      $match: {
        active: true,
        roles: {
          $in: value === "teachers" ? ["teacher"] : ["student"],
        },
      },
    },
    {
      $lookup: {
        from: "institutes",
        localField: "institute",
        foreignField: "_id",
        as: "institute",
      },
    },
    {
      $unwind: "$institute",
    },
    {
      $group: {
        _id: "$institute._id",
        label: { $first: "$institute.acronym" },
        options: {
          $push: {
            value: "$_id",
            label: {
              $concat: ["$name", "-", "$matriculation"],
            },
          },
        },
      },
    },
  ]);

  return predefinedValues[value];
};

const handler: HttpHandler = async (conn, req) => {
  const { slug } = req.params as { slug: string };

  const form = (
    await new Form(conn)
      .model()
      .findOne({
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
      })
      .populate("published")
  ).toObject() as IForm & { published: IFormDraft };

  for (const field of form?.published?.fields ?? []) {
    if (field?.predefined) {
      field.options = await getPredefinedValues(conn, field?.predefined);
    }
  }

  if (!form) {
    return res.notFound("Form not found");
  }

  return res.success(form);
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
