import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Form from "../../../models/client/Form";
import FormRepository from "../../../repositories/Form";

interface Query {
  page?: number;
  limit?: number;
}

const handler: HttpHandler = async (conn, req, context) => {
  const { page = 1, limit = 10 } = req.query as Query;

  const formRepository = new FormRepository(conn);

  const forms = await formRepository.find({
    skip: (page - 1) * limit,
    limit,
    select: {
      name: 1,
      type: 1,
      active: 1,
      slug: 1,
    },
  });

  const total = await new Form(conn).model().countDocuments();
  const totalPages = Math.ceil(total / limit);

  return res.success({
    forms,
    pagination: {
      page: Number(page),
      total,
      totalPages,
      count: forms.length + (page - 1) * limit,
    },
  });
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    query: schema
      .object({
        page: schema
          .number()
          .optional()
          .transform((v) => Number(v))
          .default(1)
          .min(1),
        limit: schema
          .number()
          .optional()
          .transform((v) => Number(v)),
      })
      .optional(),
  }))
  .configure({
    name: "FormsList",
    permission: "form.view",
    options: {
      methods: ["GET"],
      route: "forms",
    },
  });
