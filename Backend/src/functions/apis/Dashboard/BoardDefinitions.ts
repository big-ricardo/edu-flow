import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Activity from "../../../models/client/Activity";

interface Query {
  page?: number;
  limit?: number;
}

export const handler: HttpHandler = async (conn, req, context) => {
  const { page = 1, limit = 10 } = req.query as Query;

  const pendingActivities = await new Activity(conn)
    .model()
    .find({
      "evaluations.not_defined_board": true,
    })
    .select({
      _id: 1,
      name: 1,
      description: 1,
      protocol: 1,
      users: 1,
      evaluations: 1,
    })
    .exec();

  const data = pendingActivities.map((a) => {
    const activity = a.toObject();

    const evaluations = activity?.evaluations?.filter(
      (evaluation) => !evaluation.finished
    );

    return {
      ...activity,
      evaluations,
    };
  });

  return res.success(data);
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
    name: "DashboardBoardDefinitions",
    options: {
      methods: ["GET"],
      route: "dashboard/board-definitions",
    },
  });
