import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Activity, { IActivityStepStatus } from "../../../models/client/Activity";
import User from "../../../models/client/User";

interface Query {
  page?: number;
  limit?: number;
}

export const handler: HttpHandler = async (conn, req, context) => {
  const { page = 1, limit = 10 } = req.query as Query;

  const pendingActivities = await new Activity(conn)
    .model()
    .find({
      "interactions.answers.user._id": req.user.id,
      "interactions.answers.status": IActivityStepStatus.idle,
    })
    .select({
      _id: 1,
      name: 1,
      description: 1,
      protocol: 1,
      users: 1,
      "interactions.form": 1,
      "interactions.answers": 1,
    });

  const myPendingActivities = pendingActivities
    .map((activity) => {
      const interaction = activity.interactions.find((interaction) =>
        interaction.answers.some(
          (answer) => answer.user._id.toString() === req.user.id
        )
      );

      if (!interaction) {
        return null;
      }

      const myAnswer = interaction.answers.find(
        (answer) => answer.user._id.toString() === req.user.id
      );

      return {
        ...activity.toObject(),
        form: interaction.form,
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
    name: "DashboardPendingInteractions",
    options: {
      methods: ["GET"],
      route: "dashboard/my-pending-interactions",
    },
  });
