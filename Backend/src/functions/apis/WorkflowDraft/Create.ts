import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import WorkflowDraft, {
  IWorkflowDraft,
  NodeTypes,
} from "../../../models/client/WorkflowDraft";
import nodeValidator from "../../../utils/nodesValidator";
import validateGraph from "../../../utils/validateGraphs";
import Workflow from "../../../models/client/Workflow";

const handler: HttpHandler = async (conn, req) => {
  const { steps, viewport } = req.body as Pick<
    IWorkflowDraft,
    "steps" | "viewport"
  >;

  const { id } = req.params;

  validateGraph(steps);

  const existsWorkflow = await new Workflow(conn).model().exists({ _id: id });

  if (!existsWorkflow) {
    return res.notFound("Workflow not found");
  }

  const newVersion = await new WorkflowDraft(conn).model().countDocuments({
    parent: id,
  });

  console.log("user", JSON.stringify(req.user));

  const workflowDraft = await new WorkflowDraft(conn).model().create({
    version: newVersion + 1,
    owner: req.user.id,
    parent: id,
    steps,
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
        }),
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
