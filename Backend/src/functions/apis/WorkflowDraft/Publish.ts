import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import { IWorkflowDraft } from "../../../models/client/WorkflowDraft";
import WorkflowDraftRepository from "../../../repositories/WorkflowDraft";

const handler: HttpHandler = async (conn, req) => {
  const { status } = req.body as Pick<IWorkflowDraft, "status">;
  const { id } = req.params;

  const workflowDraftRepository = new WorkflowDraftRepository(conn);
  const workflowRepository = new WorkflowDraftRepository(conn);

  const workflowDraft = await workflowDraftRepository.findByIdAndUpdate({
    id,
    data: {
      status,
    },
  });

  await workflowDraftRepository.updateMany({
    where: { parent: workflowDraft.parent, _id: { $ne: workflowDraft._id } },
    data: {
      status: "draft",
    },
  });

  const workflow = await workflowRepository.findByIdAndUpdate({
    id: workflowDraft.parent,
    data: {
      published: workflowDraft._id,
    },
  });

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
    permission: "workflowDraft.publish",
    options: {
      methods: ["PATCH"],
      route: "workflow-draft/{id}",
    },
  });
