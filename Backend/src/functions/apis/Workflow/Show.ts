import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Workflow, { IStep } from "../../../models/Workflow";

const convertBackToReactFlowObject = (nodesArray: IStep[]) => {
  const nodes = nodesArray.map(({ next_step_id, ...node }) => node);
  const edges = nodesArray
    .filter((node) => node.next_step_id)
    .map((node) => ({
      id: `${node.id}-${node.next_step_id}`,
      source: node.id,
      target: node.next_step_id,
      type: "default",
    }));

  return { nodes, edges };
};

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params as { id: string };

  const workflow = await new Workflow(conn).model().findById(id);
  if (!workflow) {
    return res.notFound("Workflow not found");
  }
  const { steps, ...obj } = workflow.toObject();
  const flow = convertBackToReactFlowObject(steps);

  return res.success({
    ...obj,
    edges: flow.edges,
    nodes: flow.nodes,
  });
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
