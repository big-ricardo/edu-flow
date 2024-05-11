import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Activity, {
  IActivityAccepted,
  IActivityState,
} from "../../../models/client/Activity";
import ActivityRepository from "../../../repositories/Activity";

interface Query {
  page?: number;
  limit?: number;
}

export const handler: HttpHandler = async (conn, req, context) => {
  const { page = 1, limit = 10 } = req.query as Query;

  const activityRepository = new ActivityRepository(conn);

  const activities = await activityRepository.find({
    where: {
      state: IActivityState.created,
      "masterminds.user._id": req.user.id,
    },
    skip: (page - 1) * limit,
    limit,
  });

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
    name: "DashboardPendingActivities",
    permission: "activity.read",
    options: {
      methods: ["GET"],
      route: "dashboard/my-pending-activities",
    },
  });
