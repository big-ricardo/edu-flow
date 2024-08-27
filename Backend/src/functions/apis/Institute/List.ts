import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import InstituteRepository from "../../../repositories/Institute";

interface Query {
  page?: number;
  limit?: number;
}

const handler: HttpHandler = async (conn, req) => {
  const { page = 1, limit = 10 } = req.query as Query;

  const instituteRepository = new InstituteRepository(conn);

  const institutes = await instituteRepository.find({
    skip: (page - 1) * limit,
    limit,
  });

  const total = await instituteRepository.count();
  const totalPages = Math.ceil(total / limit);

  return res.success({
    institutes,
    pagination: {
      page: Number(page),
      total,
      totalPages,
      count: institutes.length + (page - 1) * limit,
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
    name: "InstituteList",
    permission: "institute.read",
    options: {
      methods: ["GET"],
      route: "institutes",
    },
  });
