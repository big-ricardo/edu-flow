import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import ActivityRepository from "../../../repositories/Activity";

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params as { id: string };
  const activityRepository = new ActivityRepository(conn);

  const activity = await activityRepository.findById({
    id,
  });

  if (!activity) {
    return res.notFound("Activity not found");
  }

  if (!activity.sub_masterminds?.length) {
    activity.sub_masterminds =
      activity.form_draft.fields.find((form) => form.id === "submastermind")
        ?.value ?? [];
  }

  return res.success(activity);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    params: schema.object({
      id: schema.string().required(),
    }),
  }))
  .configure({
    name: "ActivityShow",
    options: {
      methods: ["GET"],
      route: "activity/{id}",
    },
  });
