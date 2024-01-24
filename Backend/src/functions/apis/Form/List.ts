import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Form from "../../../models/Form";

interface Query {
  page?: number;
  limit?: number;
}

const handler: HttpHandler = async (conn, req, context) => {
  const { page = 1, limit = 10 } = req.query as Query;

  const forms = await new Form(conn)
    .model()
    .find()
    .select({
      name: 1,
      type: 1,
      status: 1,
      slug: 1,
    })
    .skip((page - 1) * limit)
    .limit(limit);

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
    options: {
      methods: ["GET"],
      route: "forms",
    },
  });
