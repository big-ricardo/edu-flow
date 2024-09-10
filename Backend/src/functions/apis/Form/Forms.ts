import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Status from "../../../models/client/Status";
import Workflow from "../../../models/client/Workflow";
import Institute from "../../../models/client/Institute";
import Form, { IFormType } from "../../../models/client/Form";

const handler: HttpHandler = async (conn) => {
  const status = (await new Status(conn).model().find()).map((s) => ({
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

  const institutes = (
    await new Institute(conn)
      .model()
      .find()
      .select({
        _id: 1,
        acronym: 1,
      })
      .where({
        active: true,
      })
  ).map((w) => ({
    value: w._id,
    label: w.acronym,
  }));

  const forms = (
    await new Form(conn)
      .model()
      .find()
      .select({
        _id: 1,
        name: 1,
      })
      .where({
        active: true,
        type: IFormType.Created,
      })
  ).map((w) => ({
    value: w._id,
    label: w.name,
  }));

  return res.success({
    status,
    workflows,
    institutes,
    forms,
  });
};

export default new Http(handler).configure({
  name: "FormForms",
  permission: "form.read",
  options: {
    methods: ["GET"],
    route: "form/forms",
  },
});
