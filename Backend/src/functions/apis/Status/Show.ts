import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import StatusRepository from "../../../repositories/Status";

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params as { id: string };

  const statusRepository = new StatusRepository(conn);

  const status = await statusRepository.findById({ id });

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
    permission: "status.read",
    options: {
      methods: ["GET"],
      route: "status/{id}",
    },
  });
