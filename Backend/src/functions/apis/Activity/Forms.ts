import Http, { HttpHandler } from "../../../middlewares/http";
import User, { IUserRoles } from "../../../models/client/User";
import res from "../../../utils/apiResponse";

const handler: HttpHandler = async (conn) => {
  const students = (
    await new User(conn)
      .model()
      .find({
        roles: {
          $ne: IUserRoles.teacher,
        },
        active: true,
      })
      .select({
        _id: 1,
        name: 1,
        matriculation: 1,
      })
  ).map((s) => ({
    value: s._id,
    label: `${s.name} - ${s.matriculation}`,
  }));

  const teachers = await new User(conn)
    .model()
    .find({
      roles: {
        $in: IUserRoles.teacher,
      },
      active: true,
    })
    .select({
      _id: 1,
      name: 1,
      email: 1,
      matriculation: 1,
    });

  return res.success({
    students,
    teachers,
  });
};

export default new Http(handler).configure({
  name: "ActivityForms",
  options: {
    methods: ["GET"],
    route: "activity/forms",
  },
});
