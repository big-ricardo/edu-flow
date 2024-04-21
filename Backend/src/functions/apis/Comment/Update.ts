import Http, { HttpHandler } from "../../../middlewares/http";
import Activity, { IComment } from "../../../models/client/Activity";
import res from "../../../utils/apiResponse";

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params;
  const { content } = req.body as Pick<IComment, "content">;

  const activity = await new Activity(conn).model().findById(id);

  if (!activity) {
    return res.notFound("Activity not found");
  }

  const updateComment = activity.comments.find(
    (comment) => comment._id.toString() === req.params.commentId
  );

  if (!updateComment) {
    return res.notFound("Comment not found");
  }

  updateComment.content = content;
  updateComment.isEdited = true;
  updateComment.viewed = [];

  await activity.save();

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
      route: "activity/{id}/comment/{commentId}",
    },
  });
