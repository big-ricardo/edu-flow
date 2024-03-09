import Http, { HttpHandler } from "../../../middlewares/http";
import User from "../../../models/User";
import res from "../../../utils/apiResponse";

const handler: HttpHandler = async (conn) => {
  const students = (
    await new User(conn)
      .model()
      .find({
        role: {
          $ne: "teacher",
        },
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

  const teachers = (
    await new User(conn)
      .model()
      .find({
        role: "teacher",
      })
      .select({
        _id: 1,
        name: 1,
        matriculation: 1,
      })
  ).map((t) => ({
    value: t._id,
    label: `${t.name} - ${t.matriculation}`,
  }));

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
