import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import StatusRepository from "../../../repositories/Status";

interface Query {
  page?: number;
  limit?: number;
}

const handler: HttpHandler = async (conn, req, context) => {
  const { page = 1, limit = 10 } = req.query as Query;

  const statusRepository = new StatusRepository(conn);

  const statuses = await statusRepository.find({
    skip: (page - 1) * limit,
    limit,
  });

  const total = await statusRepository.count();
  const totalPages = Math.ceil(total / limit);

  return res.success({
    statuses,
    pagination: {
      page: Number(page),
      total,
      totalPages,
      count: statuses.length + (page - 1) * limit,
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
    name: "StatusList",
    options: {
      methods: ["GET"],
      route: "statuses",
    },
  });
