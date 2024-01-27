import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Email from "../../../models/Email";
import Status from "../../../models/Status";
import User from "../../../models/User";
import Workflow, { IWorkflowStatus } from "../../../models/Workflow";
import Form, { FormStatus, FormType } from "../../../models/Form";

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

  const users = (
    await new User(conn)
      .model()
      .find({
        active: true,
      })
      .select({
        _id: 1,
        name: 1,
      })
  ).map((user) => ({
    label: user.name,
    value: user._id,
  }));

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
    {
      label: "Usuarios",
      options: users,
    },
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
        status: IWorkflowStatus.Published,
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
        type: FormType.Interaction,
        status: FormStatus.Published,
      })
      .select({
        _id: 1,
        name: 1,
      })
  ).map((w) => ({
    value: w._id,
    label: w.name,
  }));

  const formsAvailable = (
    await new Form(conn)
      .model()
      .find({
        type: FormType.Available,
        status: FormStatus.Published,
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
      available: formsAvailable,
    },
  });
};

export default new Http(handler).configure({
  name: "WorkflowForms",
  options: {
    methods: ["GET"],
    route: "workflows/forms",
  },
});
