import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Form, { IForm } from "../../../models/client/Form";
import moment from "moment";
import User from "../../../models/client/User";
import Institute from "../../../models/client/Institute";
import FormDraft, { IFormDraft } from "../../../models/client/FormDraft";

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
                "period.open": null,
              },
              {
                $and: [
                  {
                    "period.open": {
                      $lte: moment.utc().toDate(),
                    },
                  },
                  {
                    "period.close": {
                      $gte: moment.utc().toDate(),
                    },
                  },
                ],
              },
            ],
          },
        ],
      })
      .populate("published")
  )?.toObject() as IForm & { published: IFormDraft };

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
