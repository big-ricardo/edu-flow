import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import WorkflowDraft, {
  IWorkflowDraft,
  NodeTypes,
} from "../../../models/client/WorkflowDraft";
import nodeValidator from "../../../utils/nodesValidator";
import validateGraph from "../../../utils/validateGraphs";
import WorkflowRepository from "../../../repositories/Workflow";
import WorkflowDraftRepository from "../../../repositories/WorkflowDraft";

const handler: HttpHandler = async (conn, req) => {
  const { steps, viewport } = req.body as Pick<
    IWorkflowDraft,
    "steps" | "viewport"
  >;

  const { id } = req.params;

  validateGraph(steps);

  const workflowRepository = new WorkflowRepository(conn);
  const workflowDraftRepository = new WorkflowDraftRepository(conn);

  const existsWorkflow = await workflowRepository.findById({ id });

  if (!existsWorkflow) {
    return res.notFound("Workflow not found");
  }

  const newVersion = await workflowDraftRepository.count({
    parent: id,
  });

  const workflowDraft = await workflowDraftRepository.create({
    version: newVersion + 1,
    owner: req.user.id,
    parent: id,
    steps: steps.map((step) => {
      if (step.type === NodeTypes.Circle) {
        return {
          ...step,
          name: existsWorkflow.name,
        };
      }
      return step;
    }),
    viewport,
  });

  workflowDraft.save();

  return res.created(workflowDraft);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    params: schema.object().shape({
      id: schema.string().required(),
    }),
    body: schema.object().shape({
      viewport: schema.object().shape({
        x: schema.number().required(),
        y: schema.number().required(),
        zoom: schema.number().required(),
      }),
      steps: schema.array().of(
        schema.object().shape({
          id: schema.string().required(),
          type: schema.mixed().oneOf(Object.values(NodeTypes)).required(),
          position: schema.object().shape({
            x: schema.number().required(),
            y: schema.number().required(),
          }),
          deletable: schema.boolean().optional(),
          data: schema
            .object()
            .when("type", ([type]) => nodeValidator(type, schema)),
          next: schema.object().shape({
            ["default-source"]: schema.string().required().nullable(),
          }),
        })
      ),
    }),
  }))
  .configure({
    name: "WorkflowDraftCreate",
    options: {
      methods: ["POST"],
      route: "workflow-draft/{id}",
    },
  });
