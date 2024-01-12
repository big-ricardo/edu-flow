import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Status, { StatusType } from "../../../models/Status";

const handler: HttpHandler = async (conn) => {
  const status = (
    await new Status(conn).model().find().where({
      type: StatusType.PROGRESS,
    })
  ).map((s) => ({
    value: s._id,
    label: s.name,
  }));

  return res.success({
    status,
  });
};

export default new Http(handler).configure({
  name: "FormForms",
  options: {
    methods: ["GET"],
    route: "form/forms",
  },
});
