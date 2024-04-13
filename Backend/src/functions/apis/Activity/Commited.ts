import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Activity, { IActivityState } from "../../../models/Activity";
import User from "../../../models/User";
import mongoose from "mongoose";
import WorkflowDraft from "../../../models/WorkflowDraft";
import Form, { IForm } from "../../../models/Form";
import { IWorkflow } from "../../../models/Workflow";

interface IActivityUpdate {
  name: string;
  description: string;
  users: string[];
  masterminds: string[];
  sub_masterminds: {
    _id?: string;
    name: string;
    email: string;
  }[];
}

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params as { id: string };

  const activity = new Activity(conn).model();
  const user = new User(conn).model();

  const activityData = await activity.findById(id);

  if (!activityData) {
    return res.error(404, {}, "Activity not found");
  }

  const { name, description, users, sub_masterminds } =
    req.body as IActivityUpdate;

  const subMastermind = await Promise.all(
    sub_masterminds.map(async (sub) => {
      if (sub._id) {
        return (
          await user.findById(sub._id).select({ password: 0, activities: 0 })
        ).toObject();
      }

      return {
        ...sub,
        _id: new mongoose.Types.ObjectId(),
      };
    })
  );

  if (subMastermind.includes(null)) {
    return res.error(400, {}, "Invalid sub mastermind id");
  }

  const userData = await user.find({ _id: { $in: users } });

  if (userData.length !== users.length) {
    return res.error(400, {}, "Invalid user id");
  }

  const activityUpdated = await activity.findByIdAndUpdate(
    id,
    {
      name,
      description,
      users: userData.map((user) => user.toObject()),
      sub_masterminds: subMastermind,
      state: IActivityState.processing,
    },
    { new: true }
  );

  const form = (await new Form(conn)
    .model()
    .findById(activityData.form)
    .select({ workflow: 1 })
    .populate("workflow")) as Omit<IForm, "workflow"> & { workflow: IWorkflow };

  const workflowDraft = await new WorkflowDraft(conn)
    .model()
    .findById(form.workflow.published)
    .select({ steps: 1 });

  const firstStep = workflowDraft.steps.find((step) => step.id === "start");

  if (!firstStep) {
    return res.error(400, {}, "Invalid workflow");
  }

  const activityWorkflow = await activity.findByIdAndUpdate(
    id,
    {
      $push: {
        workflows: {
          workflow_draft: workflowDraft,
          steps: {
            step: firstStep,
            status: "idle",
          },
        },
      },
    },
    { new: true }
  );

  await activityWorkflow.save();

  return res.success(activityUpdated);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    params: schema.object({
      id: schema.string().required(),
    }),
    body: schema.object({
      name: schema.string().required(),
      description: schema.string().required(),
      users: schema.array(schema.string()).required(),
      sub_masterminds: schema
        .array(
          schema.object({
            _id: schema.string().optional(),
            name: schema.string().required(),
            email: schema.string().email().required(),
          })
        )
        .required(),
    }),
  }))
  .configure({
    name: "ActivityCommitted",
    options: {
      methods: ["PUT"],
      route: "activity-committed/{id}",
    },
  });
