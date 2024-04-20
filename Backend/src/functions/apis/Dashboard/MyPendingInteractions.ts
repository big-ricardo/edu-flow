import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Activity, {
  IActivityAccepted,
  IActivityState,
} from "../../../models/Activity";
import User from "../../../models/User";

interface Query {
  page?: number;
  limit?: number;
}

export const handler: HttpHandler = async (conn, req, context) => {
  const { page = 1, limit = 10 } = req.query as Query;

  const pendingActivities = await new User(conn)
    .model()
    .findById(req.user.id)
    .select({
      activity_pending: 1,
    })
    .populate("activity_pending.activity", {
      name: 1,
      description: 1,
      protocol: 1,
      users: {
        name: 1,
        matriculation: 1,
      },
    })
    .populate("activity_pending.form", {
      name: 1,
      description: 1,
      slug: 1,
      period: 1,
    });

  return res.success(pendingActivities.activity_pending);
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
    name: "DashboardPendingInteractions",
    options: {
      methods: ["GET"],
      route: "dashboard/my-pending-interactions",
    },
  });
