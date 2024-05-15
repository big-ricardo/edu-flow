import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import {
  IActivityAccepted,
  IActivityStepStatus,
} from "../../../models/client/Activity";
import ActivityRepository from "../../../repositories/Activity";
import UserRepository from "../../../repositories/User";

interface Query {
  page?: number;
  limit?: number;
}

export const handler: HttpHandler = async (conn, req, context) => {
  const { page = 1, limit = 10 } = req.query as Query;

  const activityRepository = new ActivityRepository(conn);
  const userRepository = new UserRepository(conn);

  const user = await userRepository.findById({ id: req.user.id });

  const activities = await activityRepository.find({
    where: {
      // $or: [
      //   {
      //     "masterminds.user._id": user._id,
      //     "masterminds.status": IActivityAccepted.accepted,
      //   },
      //   {
      //     "sub_masterminds._id": user._id,
      //   },
      // ],
      "masterminds.user._id": user._id,
    },
    select: {
      _id: 1,
      name: 1,
      description: 1,
      protocol: 1,
      createdAt: 1,
    },
  });

  return res.success(activities);
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
    name: "DashboardActivitiesTracking",
    permission: "activity.update",
    options: {
      methods: ["GET"],
      route: "dashboard/my-activity-tracking",
    },
  });
