import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Comment, { IComment } from "../../../models/Comment";

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params;
  const { content } = req.body as Pick<IComment, "content">;

  const comment = new Comment(conn).model();
  const updateComment = await comment.findByIdAndUpdate(
    id,
    { content, viewed: [], isEdited: true },
    { new: true },
  );

  if (!updateComment) {
    return res.notFound("Comment not found");
  }

  return res.success({
    ...updateComment.toObject(),
    user: {
      _id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    },
  });
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    body: schema.object().shape({
      content: schema.string().required(),
    }),
    params: schema.object().shape({
      id: schema.string().required(),
    }),
  }))
  .configure({
    name: "CommentUpdate",
    options: {
      methods: ["PUT"],
      route: "comment/{id}",
    },
  });
