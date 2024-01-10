import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Workflow, {
  ICircle,
  IWorkflow,
  NodeTypes,
} from "../../../models/Workflow";
import nodeValidator from "../../../utils/nodesValidator";
import validateGraph from "../../../utils/validateGraphs";

const handler: HttpHandler = async (conn, req) => {
  const { steps, viewport } = req.body as Pick<IWorkflow, "steps" | "viewport">;

  validateGraph(steps);

  const {
    name,
    visible,
    active = true,
  } = steps.find((step) => step.id === "start")?.data as ICircle;

  const workflow = await new Workflow(conn).model().create({
    name,
    visible,
    active,
    steps,
    viewport,
  });

  workflow.save();

  return res.created(workflow);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    body: schema.object().shape({
      viewport: schema.object().shape({
        x: schema.number().required(),
        y: schema.number().required(),
        zoom: schema.number().required(),
      }),
      steps: schema.array().of(
        schema.object().shape({
          id: schema.string().required(),
          type: schema
            .mixed()
            .oneOf(Object.values(NodeTypes))
            .required(),
          position: schema.object().shape({
            x: schema.number().required(),
            y: schema.number().required(),
          }),
          data: schema
            .object()
            .when("type", ([type]) => nodeValidator(type, schema)),
          nextStepId: schema.string().optional(),
        })
      ),
    }),
  }))
  .configure({
    name: "WorkflowCreate",
    options: {
      methods: ["POST"],
      route: "workflow",
    },
  });