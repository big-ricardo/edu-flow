import Http, { HttpHandler } from "../../../middlewares/http";
import Workflow from "../../../models/Workflow";
import res from "../../../utils/apiResponse";

interface Query {
  page?: number;
  limit?: number;
}

const handler: HttpHandler = async (conn, req, context) => {
  const { page = 1, limit = 10 } = req.query as Query;

  const workflows = await new Workflow(conn)
    .model()
    .find()
    .select({
      name: 1,
      active: 1,
    })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await new Workflow(conn).model().countDocuments();
  const totalPages = Math.ceil(total / limit);

  return res.success({
    workflows,
    pagination: {
      page: Number(page),
      total,
      totalPages,
      count: workflows.length + (page - 1) * limit,
    },
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
      route: "workflows",
    },
  });
