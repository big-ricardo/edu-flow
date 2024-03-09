import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Comment, { IComment } from "../../../models/Comment";

const handler: HttpHandler = async (conn, req) => {
  const data = req.body as Pick<IComment, "content">;

  const comment = await new Comment(conn).model().create({
    ...data,
    activity: req.params.id,
    user: req.user.id,
  });

  comment.save();

  return res.created({
    ...comment.toObject(),
    user: {
      _id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    },
  });
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    params: schema.object().shape({
      id: schema.string().required(),
    }),
    body: schema.object().shape({
      content: schema.string().required(),
    }),
  }))
  .configure({
    name: "CommentCreate",
    options: {
      methods: ["POST"],
      route: "comment/{id}",
    },
  });
