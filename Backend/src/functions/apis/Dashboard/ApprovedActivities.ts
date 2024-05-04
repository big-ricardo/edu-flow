import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import { IActivityState } from "../../../models/client/Activity";
import ActivityRepository from "../../../repositories/Activity";

interface Query {
  page?: number;
  limit?: number;
}

export const handler: HttpHandler = async (conn, req, context) => {
  const { page = 1, limit = 10 } = req.query as Query;

  const activityRepository = new ActivityRepository(conn);

  const activities = await activityRepository.find({
    where: { state: IActivityState.committed },
    populate: [
      {
        path: "users",
        select: {
          _id: 1,
          name: 1,
          matriculation: 1,
        },
      },
    ],
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
    name: "DashboardApprovedActivities",
    options: {
      methods: ["GET"],
      route: "dashboard/approved-activities",
    },
  });
