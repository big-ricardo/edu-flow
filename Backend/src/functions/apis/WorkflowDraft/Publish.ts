import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import WorkflowDraft, { IWorkflowDraft } from "../../../models/WorkflowDraft";
import Workflow from "../../../models/Workflow";

const handler: HttpHandler = async (conn, req) => {
  const { status } = req.body as Pick<IWorkflowDraft, "status">;
  const { id } = req.params;

  const workflowDraft = await new WorkflowDraft(conn).model().findByIdAndUpdate(
    id,
    {
      status,
    },
    { new: true },
  );

  await new WorkflowDraft(conn).model().updateMany(
    { parent: workflowDraft.parent, _id: { $ne: workflowDraft._id } },
    {
      status: "draft",
    },
  );

  const workflow = await new Workflow(conn).model().findByIdAndUpdate(
    workflowDraft.parent,
    {
      published: workflowDraft._id,
    },
    { new: true },
  );

  workflowDraft.save();
  workflow.save();

  return res.created(workflowDraft);
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
      route: "workflow-draft/{id}",
    },
  });
