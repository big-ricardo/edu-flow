import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Form, { IForm } from "../../../models/Form";
import moment from "moment";
import User from "../../../models/User";
import Institute from "../../../models/Institute";
import FormDraft, { IFormDraft } from "../../../models/FormDraft";

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
