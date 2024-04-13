import Http, { HttpHandler } from "../../../middlewares/http";
import Activity, { IComment } from "../../../models/Activity";
import res from "../../../utils/apiResponse";

const handler: HttpHandler = async (conn, req) => {
  const data = req.body as Pick<IComment, "content">;

  const comment = await new Activity(conn).model().findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        comments: {
          user: {
            _id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            matriculation: req.user.matriculation,
          },
          content: data.content,
        },
      },
    },
    { new: true }
  );

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
