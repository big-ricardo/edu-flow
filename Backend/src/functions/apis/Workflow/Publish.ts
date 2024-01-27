import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Workflow, { IWorkflow } from "../../../models/Workflow";

const handler: HttpHandler = async (conn, req) => {
  const { status } = req.body as Pick<IWorkflow, "status">;
  const { id } = req.params;

  const workflow = await new Workflow(conn).model().findByIdAndUpdate(
    id,
    {
      status,
    },
    { new: true },
  );

  workflow.save();

  return res.created(workflow);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    params: schema.object().shape({
      id: schema.string().required(),
    }),
    body: schema.object().shape({
      status: schema.string().oneOf(["draft", "published"]).optional(),
    }),
  }))
  .configure({
    name: "WorkflowPublish",
    options: {
      methods: ["PATCH"],
      route: "workflow/{id}",
    },
  });
