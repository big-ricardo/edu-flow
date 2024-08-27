import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Email from "../../../models/client/Email";
import Status from "../../../models/client/Status";
import Workflow from "../../../models/client/Workflow";
import Form, { IFormType } from "../../../models/client/Form";
import InstituteRepository from "../../../repositories/Institute";
import UserRepository from "../../../repositories/User";

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

  const users = await new UserRepository(conn).find({
    where: {
      active: true,
    },
    select: {
      _id: 1,
      name: 1,
    },
  });

  const institutes = await new InstituteRepository(conn).find({
    where: {
      active: true,
    },
  });

  const userOptions = [
    {
      label: "Especiais",
      options: [
        {
          label: "Solicitante",
          value: "${{activity.#users.email}}",
        },
      ],
    },
    {
      label: "Instituições",
      options: institutes.map((institute) => ({
        label: institute.name,
        value: institute._id,
      })),
    },
    {
      label: "Usuários",
      options: users.map((user) => ({
        label: user.name,
        value: user._id,
      })),
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
