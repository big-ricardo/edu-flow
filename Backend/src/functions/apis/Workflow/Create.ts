import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Workflow, { IWorkflow } from "../../../models/client/Workflow";

const handler: HttpHandler = async (conn, req) => {
  const data = req.body as IWorkflow;

  const workflow = await new Workflow(conn).model().create(data);

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
    name: "WorkflowCreate",
    options: {
      methods: ["POST"],
      route: "workflow",
    },
  });
