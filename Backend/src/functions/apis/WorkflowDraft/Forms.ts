import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Email from "../../../models/Email";
import Status from "../../../models/Status";
import User from "../../../models/User";
import Workflow from "../../../models/Workflow";
import Form, { IFormType } from "../../../models/Form";

const handler: HttpHandler = async (conn) => {
  const emails = (
    await new Email(conn).model().find().select({
      _id: 1,
      slug: 1,
    })
  ).map((email) => ({
    label: email.slug,
    value: email._id,
  }));

  const users = await new User(conn).model().aggregate([
    {
      $match: {
        active: true,
      },
    },
    {
      $group: {
        _id: "$role",
        label: { $first: "$role" },
        options: {
          $push: {
            value: "$_id",
            label: "$name",
          },
        },
      },
    },
  ]);

  const userOptions = [
    {
      label: "Especiais",
      options: [
        {
          label: "Aluno/s",
          value: "{{student}}",
        },
        {
          label: "Orientadores",
          value: "{{masterminds}}",
        },
      ],
    },
    ...users,
  ];

  const statuses = (
    await new Status(conn).model().find().select({
      _id: 1,
      name: 1,
    })
  ).map((status) => ({
    label: status.name,
    value: status._id,
  }));

  const workflows = (
    await new Workflow(conn)
      .model()
      .find({
        active: true,
        published: { $exists: true },
      })
      .select({
        _id: 1,
        name: 1,
      })
  ).map((status) => ({
    label: status.name,
    value: status._id,
  }));

  const formsInteraction = (
    await new Form(conn)
      .model()
      .find({
        type: IFormType.Interaction,
        active: true,
        published: { $exists: true, $ne: null },
      })
      .select({
        _id: 1,
        name: 1,
      })
  ).map((w) => ({
    value: w._id,
    label: w.name,
  }));

  const formsEvaluated = (
    await new Form(conn)
      .model()
      .find({
        type: IFormType.Evaluated,
        active: true,
        published: { $exists: true },
      })
      .select({
        _id: 1,
        name: 1,
      })
  ).map((w) => ({
    value: w._id,
    label: w.name,
  }));

  return res.success({
    emails,
    statuses,
    users: userOptions,
    workflows,
    forms: {
      interaction: formsInteraction,
      evaluated: formsEvaluated,
    },
  });
};

export default new Http(handler).configure({
  name: "WorkflowForms",
  options: {
    methods: ["GET"],
    route: "workflows-draft/forms",
  },
});
