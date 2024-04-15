import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import User, { IUserRoles } from "../../../models/User";

const handler: HttpHandler = async (conn, req, context) => {
  const { role } = req.params as { role: IUserRoles };

  const users = await new User(conn)
    .model()
    .find({
      active: true,
      isExternal: false,
      roles: {
        $elemMatch: {
          $eq: role,
        },
      },
    })
    .select({
      password: 0,
    });

  return res.success(users);
};

export default new Http(handler).configure({
  name: "FieldTeacherList",
  options: {
    methods: ["GET"],
    route: "field/users/{role}",
  },
});
