import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import User from "../../../models/client/User";

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params as { id: string };

  const user = await new User(conn).model().findById(id).select({
    password: 0,
    __v: 0,
  });

  if (!user) {
    return res.notFound("User not found");
  }

  return res.success(user);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    params: schema.object({
      id: schema.string().required(),
    }),
  }))
  .configure({
    name: "UserShow",
    options: {
      methods: ["GET"],
      route: "user/{id}",
    },
  });
