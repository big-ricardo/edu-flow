import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import { IWorkflow } from "../../../models/client/Workflow";
import WorkflowRepository from "../../../repositories/Workflow";

const handler: HttpHandler = async (conn, req) => {
  const data = req.body as IWorkflow;
  const { id } = req.params;

  const workflowRepository = new WorkflowRepository(conn);

  const workflow = await workflowRepository.findByIdAndUpdate({ id, data });

  workflow.save();

  return res.created(workflow);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    body: schema.object().shape({
      name: schema.string().required().min(3).max(255),
      active: schema.boolean().required(),
    }),
  }))
  .configure({
    name: "WorkflowUpdate",
    permission: "workflow.update",
    options: {
      methods: ["PUT"],
      route: "workflow/{id}",
    },
  });
