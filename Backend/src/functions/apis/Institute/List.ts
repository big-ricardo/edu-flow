import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Institute from "../../../models/client/Institute";

interface Query {
  page?: number;
  limit?: number;
}

const handler: HttpHandler = async (conn, req) => {
  const { page = 1, limit = 10 } = req.query as Query;

  const institutes = await new Institute(conn)
    .model()
    .find()
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("university", {
      _id: 1,
      acronym: 1,
    });

  const total = await new Institute(conn).model().countDocuments();
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
    options: {
      methods: ["GET"],
      route: "institutes",
    },
  });
