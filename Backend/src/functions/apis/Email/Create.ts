import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Email, { IEmail } from "../../../models/client/Email";

export const handler: HttpHandler = async (conn, req) => {
  const { slug, htmlTemplate, subject, cssTemplate } = req.body as IEmail;

  const email = await new Email(conn).model().create({
    slug,
    subject,
    htmlTemplate,
    cssTemplate,
  });

  if (email instanceof Error) {
    return res.badRequest(email.message);
  }

  email.save();

  return res.created(email);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    body: schema.object().shape({
      slug: schema
        .string()
        .matches(/^[A-Za-z]+([A-za-z0-9]+)+(-[A-Za-z0-9]+)*$/)
        .min(3)
        .max(50)
        .required(),
      subject: schema.string().required().min(3),
      htmlTemplate: schema.string().required().min(3),
    }),
  }))
  .configure({
    name: "EmailCreate",
    options: {
      methods: ["POST"],
      route: "email",
    },
  });
