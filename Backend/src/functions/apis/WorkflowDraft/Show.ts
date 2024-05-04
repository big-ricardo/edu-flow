import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import WorkflowDraft, { IStep } from "../../../models/client/WorkflowDraft";
import WorkflowDraftRepository from "../../../repositories/WorkflowDraft";

const convertBackToReactFlowObject = (nodesArray: IStep[]) => {
  const nodes = nodesArray.map(({ next, ...node }) => node);

  const edges = nodesArray.reduce((acc, node) => {
    const defaultTarget = node.next["default-source"];
    const alternativeTarget = node.next["alternative-source"];

    if (!!defaultTarget) {
      acc.push({
        id: `default-source-${node.id}-${defaultTarget}`,
        source: node.id,
        target: defaultTarget,
        sourceHandle: "default-source",
      });
    }

    if (!!alternativeTarget) {
      acc.push({
        id: `alternative-source-${node.id}-${alternativeTarget}`,
        source: node.id,
        target: alternativeTarget,
        sourceHandle: "alternative-source",
      });
    }

    return acc;
  }, []);

  return { nodes, edges };
};

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params as { id: string };
  const workflowDraftRepository = new WorkflowDraftRepository(conn);

  const workflow = await workflowDraftRepository.findById({ id });

  if (!workflow) {
    return res.notFound("WorkflowDraft not found");
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
    name: "WorkflowDraftShow",
    options: {
      methods: ["GET"],
      route: "workflow-draft/{id}",
    },
  });
