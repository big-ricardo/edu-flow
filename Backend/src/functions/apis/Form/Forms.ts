import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Status, { StatusType } from "../../../models/Status";
import Workflow from "../../../models/Workflow";

const handler: HttpHandler = async (conn) => {
  const status = (
    await new Status(conn).model().find().where({
      type: StatusType.PROGRESS,
    })
  ).map((s) => ({
    value: s._id,
    label: s.name,
  }));

  const workflows = (
    await new Workflow(conn)
      .model()
      .find()
      .select({
        _id: 1,
        name: 1,
      })
      .where({
        active: true,
        published: { $exists: true },
      })
  ).map((w) => ({
    value: w._id,
    label: w.name,
  }));

  return res.success({
    status,
    workflows,
  });
};

export default new Http(handler).configure({
  name: "FormForms",
  options: {
    methods: ["GET"],
    route: "form/forms",
  },
});
