import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Status from "../../../models/client/Status";

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params as { id: string };

  const status = await new Status(conn).model().findById(id);

  if (!status) {
    return res.notFound("Status not found");
  }

  return res.success(status);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    params: schema.object({
      id: schema.string().required(),
    }),
  }))
  .configure({
    name: "StatusShow",
    options: {
      methods: ["GET"],
      route: "status/{id}",
    },
  });
