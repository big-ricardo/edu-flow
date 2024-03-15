import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Activity, {
  IActivityAccepted,
  IActivityState,
} from "../../../models/Activity";

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params as { id: string };
  const { accepted } = req.body as { accepted: IActivityAccepted };

  const activity = await new Activity(conn).model().findById(id).exec();

  if (!activity) return res.notFound("Atividade não encontrada");

  activity.masterminds = activity.masterminds.map((mastermind) => {
    if (mastermind.user.toString() === req.user.id) {
      mastermind.accepted = accepted;
    }
    return mastermind;
  });

  const activityUpdated = await activity.save();

  const allTheMastermindsAccepted = activity.masterminds.every(
    (mastermind) => mastermind.accepted === IActivityAccepted.accepted
  );

  if (allTheMastermindsAccepted) {
    activityUpdated.state = IActivityState.committed;
    await activityUpdated.save();
  }

  return res.success(activityUpdated);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    params: schema.object({
      id: schema.string().required(),
    }),
    body: schema.object({
      accepted: schema
        .mixed()
        .oneOf(Object.values(IActivityAccepted))
        .required(),
    }),
  }))
  .configure({
    name: "ActivityAccept",
    options: {
      methods: ["PUT"],
      route: "activity-accept/{id}",
    },
  });
