import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import University from "../../../models/client/University";

interface Query {
  page?: number;
  limit?: number;
}

const handler: HttpHandler = async (conn, req, context) => {
  const { page = 1, limit = 10 } = req.query as Query;

  const universities = await new University(conn)
    .model()
    .find()
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await new University(conn).model().countDocuments();
  const totalPages = Math.ceil(total / limit);

  return res.success({
    universities,
    pagination: {
      page: Number(page),
      total,
      totalPages,
      count: universities.length + (page - 1) * limit,
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
    name: "UniversityList",
    options: {
      methods: ["GET"],
      route: "universities",
    },
  });
