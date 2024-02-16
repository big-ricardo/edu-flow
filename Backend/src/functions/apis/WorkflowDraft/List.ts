import Http, { HttpHandler } from "../../../middlewares/http";
import WorkflowDraft from "../../../models/WorkflowDraft";
import res from "../../../utils/apiResponse";

interface Query {
  page?: number;
  limit?: number;
}

const handler: HttpHandler = async (conn, req, context) => {
  const { id } = req.params;

  const workflows = await new WorkflowDraft(conn)
    .model()
    .find({
      parent: id,
    })
    .populate("owner", {
      _id: true,
      name: true,
    })
    .select({
      _id: true,
      version: true,
      status: true,
      createdAt: true,
    })
    .sort({ createdAt: -1 });

  return res.success({
    workflows,
  });
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    query: schema
      .object({
        page: schema
          .number()
          .optional()
          .transform((v) => Number(v))
          .default(1)
          .min(1),
        limit: schema
          .number()
          .optional()
          .transform((v) => Number(v)),
      })
      .optional(),
  }))
  .configure({
    name: "WorkflowsList",
    options: {
      methods: ["GET"],
      route: "workflow-drafts/{id}",
    },
  });
