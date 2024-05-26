import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import { IActivityStepStatus } from "../../../models/client/Activity";
import ActivityRepository from "../../../repositories/Activity";

interface Query {
  page?: number;
  limit?: number;
}

export const handler: HttpHandler = async (conn, req, context) => {
  const { page = 1, limit = 10 } = req.query as Query;

  const activityRepository = new ActivityRepository(conn);

  const pendingActivities = await activityRepository.find({
    where: {
      "evaluations.answers.user._id": req.user.id,
      "evaluations.answers.status": IActivityStepStatus.idle,
    },
    select: {
      _id: 1,
      name: 1,
      description: 1,
      protocol: 1,
      users: 1,
      "evaluations.form": 1,
      "evaluations.answers": 1,
    },
  });
  //TODO: Fix this query returning all activities with evaluations
  const myPendingActivities = pendingActivities
    .map((activity) => {
      const evaluation = activity.evaluations.find((evaluation) =>
        evaluation.answers.some(
          (answer) => answer.user._id.toString() === req.user.id
        )
      );

      if (!evaluation) {
        return null;
      }

      const myAnswer = evaluation.answers.find(
        (answer) => answer.user._id.toString() === req.user.id
      );

      return {
        ...activity.toObject(),
        form: evaluation.form,
        status: myAnswer.status,
      };
    })
    .filter((activity) => activity !== null);

  return res.success(myPendingActivities);
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
    name: "DashboardPendingEvaluations",
    permission: "activity.update",
    options: {
      methods: ["GET"],
      route: "dashboard/my-pending-evaluations",
    },
  });
