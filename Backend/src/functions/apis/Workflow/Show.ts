import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import WorkflowRepository from "../../../repositories/Workflow";

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params as { id: string };
  const workflowRepository = new WorkflowRepository(conn);

  const workflow = await workflowRepository.findById({ id });

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
