import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import User from "../../../models/client/User";
import UserRepository from "../../../repositories/User";

interface Query {
  page?: number;
  limit?: number;
}

const handler: HttpHandler = async (conn, req, context) => {
  const { page = 1, limit = 10 } = req.query as Query;
  const userRepository = new UserRepository(conn);

  const users = await userRepository.find({
    sort: {
      name: 1,
    },
    skip: (page - 1) * limit,
    limit,
  });

  const total = await new User(conn).model().countDocuments();
  const totalPages = Math.ceil(total / limit);

  return res.success({
    users,
    pagination: {
      page: Number(page),
      total,
      totalPages,
      count: users.length + (page - 1) * limit,
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
    name: "UsersList",
    options: {
      methods: ["GET"],
      route: "users",
    },
  });
