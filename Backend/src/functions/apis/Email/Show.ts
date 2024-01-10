import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Email from "../../../models/Email";

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params as { id: string };

  const email = await new Email(conn).model().findById(id);

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
    options: {
      methods: ["GET"],
      route: "email/{id}",
    },
  });
