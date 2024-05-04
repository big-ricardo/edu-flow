import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import FormRepository from "../../../repositories/Form";

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params as { id: string };

  const formRepository = new FormRepository(conn);

  const form = await formRepository.find({
    where: { id },
    populate: [
      {
        path: "populate",
        select: {
          name: 1,
          _id: 1,
        },
      },
    ],
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
    options: {
      methods: ["GET"],
      route: "form/{id}",
    },
  });
