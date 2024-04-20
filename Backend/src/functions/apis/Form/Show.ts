import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Form from "../../../models/Form";

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params as { id: string };

  const form = await new Form(conn).model().findById(id).populate("published");

  if (!form) {
    return res.notFound("Form not found");
  }

  return res.success(form);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    params: schema.object({
      id: schema.string().required(),
    }),
  }))
  .configure({
    name: "FormShow",
    options: {
      methods: ["GET"],
      route: "form/{id}",
    },
  });
