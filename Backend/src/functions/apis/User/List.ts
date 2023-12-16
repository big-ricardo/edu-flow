import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import User, { IUser } from "../../../models/User";

const handler: HttpHandler = async (conn, req, context) => {
  const users: IUser[] = await User.find().select({
    password: 0,
  }).populate("institute");

  return res.success(users);
};

export default new Http(handler).configure({
  name: "UsersList",
  options: {
    methods: ["GET"],
    route: "users",
  },
});
