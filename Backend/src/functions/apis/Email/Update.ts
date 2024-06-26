import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import { IEmail } from "../../../models/client/Email";
import EmailRepository from "../../../repositories/Email";

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params;
  const { slug, htmlTemplate, subject, cssTemplate } = req.body as IEmail;

  const emailRepository = new EmailRepository(conn);

  const updateEmail = await emailRepository.findByIdAndUpdate({
    id,
    data: {
      slug,
      htmlTemplate,
      subject,
      cssTemplate,
    },
  });

  if (!updateEmail) {
    return res.notFound("Email not found");
  }

  return res.success(updateEmail);
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
      htmlTemplate: schema.string().required().min(3),
      subject: schema.string().required().min(3),
    }),
    params: schema.object().shape({
      id: schema.string().required(),
    }),
  }))
  .configure({
    name: "EmailUpdate",
    permission: "email.update",
    options: {
      methods: ["PUT"],
      route: "email/{id}",
    },
  });
