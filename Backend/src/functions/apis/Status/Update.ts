import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Status, { IStatus } from "../../../models/Status";

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params;
  const { name, type } = req.body as IStatus;

  const status = new Status(conn).model();
  const updateStatus = await status.findByIdAndUpdate(
    id,
    { name, type },
    { new: true },
  );

  if (!updateStatus) {
    return res.notFound("Status not found");
  }

  return res.success(updateStatus);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    body: schema.object().shape({
      name: schema.string().optional().min(3).max(255),
      type: schema.string().optional().oneOf(["progress", "done", "canceled"]),
    }),
    params: schema.object().shape({
      id: schema.string().required(),
    }),
  }))
  .configure({
    name: "StatusUpdate",
    options: {
      methods: ["PUT"],
      route: "status/{id}",
    },
  });
