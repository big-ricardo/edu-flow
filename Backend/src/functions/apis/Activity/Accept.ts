import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Activity, { IActivityAccepted } from "../../../models/Activity";

interface IActivityUpdate {
  name: string;
  description: string;
  users: string[];
  masterminds: string[];
  sub_masterminds: string[];
}

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

  activity.sub_masterminds = activity.sub_masterminds.map((sub_mastermind) => {
    if (sub_mastermind.user.toString() === req.user.id) {
      sub_mastermind.accepted = accepted;
    }
    return sub_mastermind;
  });

  const activityUpdated = await activity.save();

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
