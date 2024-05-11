import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import FormRepository from "../../../repositories/Form";

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params as { id: string };

  const formRepository = new FormRepository(conn);

  const form = await formRepository.findOne({
    where: { _id: id },
  });

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
    permission: "form.read",
    options: {
      methods: ["GET"],
      route: "form/{id}",
    },
  });
