import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import University from "../../../models/client/University";
import UniversityRepository from "../../../repositories/University";

interface Query {
  page?: number;
  limit?: number;
}

const handler: HttpHandler = async (conn, req, context) => {
  const { page = 1, limit = 10 } = req.query as Query;
  const universityRepository = new UniversityRepository(conn);

  const universities = await universityRepository.find({
    skip: (page - 1) * limit,
    limit,
  });

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
    permission: "university.read",
    options: {
      methods: ["GET"],
      route: "universities",
    },
  });
