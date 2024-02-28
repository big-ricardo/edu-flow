import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Activity from "../../../models/Activity";

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params as { id: string };

  const activity = await new Activity(conn)
    .model()
    .findById(id)
    .populate("users", {
      _id: 1,
      name: 1,
      matriculation: 1,
      email: 1,
    })
    .populate("status", {
      _id: 1,
      name: 1,
    });

  if (!activity) {
    return res.notFound("Email not found");
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
