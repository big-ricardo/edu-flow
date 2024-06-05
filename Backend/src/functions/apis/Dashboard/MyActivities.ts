import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import User from "../../../models/client/User";
import ActivityRepository from "../../../repositories/Activity";

interface Query {
  page?: number;
  limit?: number;
}

export const handler: HttpHandler = async (conn, req, context) => {
  const { page = 1, limit = 10 } = req.query as Query;

  const activityRepository = new ActivityRepository(conn);

  const user = await new User(conn).model().findById(req.user.id);

  const activities = await activityRepository.find({
    where: {
      "users._id": user._id,
      finished_at: null,
    },
    select: {
      name: 1,
      description: 1,
      protocol: 1,
      createdAt: 1,
    },
    populate: [
      {
        path: "form",
        select: {
          name: 1,
          slug: 1,
        },
      },
    ],
  });

  const finishedActivities = await activityRepository.find({
    where: {
      "users._id": user._id,
      finished_at: { $ne: null },
    },
    select: {
      name: 1,
      description: 1,
      protocol: 1,
      finished_at: 1,
      createdAt: 1,
    },
    populate: [
      {
        path: "form",
        select: {
          name: 1,
          slug: 1,
        },
      },
    ],
  });

  return res.success({
    activities,
    finishedActivities,
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
        finished: schema.boolean().optional(),
      })
      .optional(),
  }))
  .configure({
    name: "DashboardMyActivities",
    permission: "activity.read",
    options: {
      methods: ["GET"],
      route: "dashboard/my-activities",
    },
  });
