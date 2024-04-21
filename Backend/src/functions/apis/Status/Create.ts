import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Status, { IStatus } from "../../../models/client/Status";

const handler: HttpHandler = async (conn, req) => {
  const { name, type } = req.body as IStatus;

  const status = await new Status(conn).model().create({
    name,
    type,
  });

  status.save();

  return res.created(status);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    body: schema.object().shape({
      name: schema.string().required().min(3).max(255),
      type: schema.string().required().oneOf(["progress", "done", "canceled"]),
    }),
  }))
  .configure({
    name: "StatusCreate",
    options: {
      methods: ["POST"],
      route: "status",
    },
  });
