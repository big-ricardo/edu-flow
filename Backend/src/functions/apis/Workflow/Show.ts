import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Workflow from "../../../models/client/Workflow";

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params as { id: string };

  const workflow = await new Workflow(conn).model().findById(id);

  if (!workflow) {
    return res.notFound("Workflow not found");
  }

  return res.success(workflow);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    params: schema.object({
      id: schema.string().required(),
    }),
  }))
  .configure({
    name: "WorkflowShow",
    options: {
      methods: ["GET"],
      route: "workflow/{id}",
    },
  });
