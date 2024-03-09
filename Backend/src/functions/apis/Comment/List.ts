import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Comment from "../../../models/Comment";

interface Query {
  page?: number;
  limit?: number;
}

const handler: HttpHandler = async (conn, req, context) => {
  const { page = 1, limit = 10 } = req.query as Query;

  const comments = await new Comment(conn)
    .model()
    .find({ activity: req.params.id })
    .populate("user", {
      _id: 1,
      name: 1,
      email: 1,
    })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await new Comment(conn).model().countDocuments();
  const totalPages = Math.ceil(total / limit);

  return res.success({
    comments,
    pagination: {
      page: Number(page),
      total,
      totalPages,
      count: comments.length + (page - 1) * limit,
    },
  });
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    params: schema.object().shape({
      id: schema.string().required(),
    }),
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
    name: "CommentList",
    options: {
      methods: ["GET"],
      route: "comments/{id}",
    },
  });
