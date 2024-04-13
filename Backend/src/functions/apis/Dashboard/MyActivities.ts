import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Activity from "../../../models/Activity";
import User from "../../../models/User";

interface Query {
  page?: number;
  limit?: number;
}

export const handler: HttpHandler = async (conn, req, context) => {
  const { page = 1, limit = 10 } = req.query as Query;

  const user = await new User(conn).model().findById(req.user.id);

  const activities = await new Activity(conn)
    .model()
    .find({
      _id: {
        $in: user.activities,
      },
    })
    .populate("users", {
      _id: 1,
      name: 1,
      matriculation: 1,
    })
    .populate("form", {
      name: 1,
      slug: 1,
    })
    .skip((page - 1) * limit)
    .limit(limit);

  return res.success({
    activities,
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
    name: "DashboardMyActivities",
    options: {
      methods: ["GET"],
      route: "dashboard/my-activities",
    },
  });
