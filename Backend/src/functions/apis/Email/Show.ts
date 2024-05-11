import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import EmailRepository from "../../../repositories/Email";

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params as { id: string };

  const emailRepository = new EmailRepository(conn);

  const email = await emailRepository.findById({id});

  if (!email) {
    return res.notFound("Email not found");
  }

  return res.success(email);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    params: schema.object({
      id: schema.string().required(),
    }),
  }))
  .configure({
    name: "EmailShow",
    permission: "email.read",
    options: {
      methods: ["GET"],
      route: "email/{id}",
    },
  });
