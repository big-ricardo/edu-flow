import QueueWrapper, {
  GenericMessage,
  QueueWrapperHandler,
} from "../../middlewares/queue";
import Activity from "../../models/client/Activity";
import Form from "../../models/client/Form";
import User from "../../models/client/User";
import { IInteraction, NodeTypes } from "../../models/client/WorkflowDraft";
import sendNextQueue from "../../utils/sendNextQueue";

interface TMessage extends GenericMessage {}

const handler: QueueWrapperHandler<TMessage> = async (
  conn,
  messageQueue,
  context
) => {
  try {
    const { activity_id, activity_step_id, activity_workflow_id } =
      messageQueue;

    const activity = await new Activity(conn).model().findById(activity_id);

    if (!activity) {
      throw new Error("Activity not found");
    }

    const activityWorkflow = activity.workflows.find(
      (workflow) => workflow._id.toString() === activity_workflow_id
    );

    if (!activityWorkflow) {
      throw new Error("Workflow not found");
    }

    const {
      workflow_draft: { steps },
    } = activityWorkflow;

    context.log("activityWorkflow", activityWorkflow);

    const activityStep = activityWorkflow.steps.find(
      (step) => step._id.toString() === activity_step_id
    );

    if (!activityStep) {
      throw new Error("Step not found");
    }

    const step = steps.find(
      (step) => step._id.toString() === activityStep.step.toString()
    );

    if (!step) {
      throw new Error("Step not found");
    }

    const { data } = step as { data: IInteraction };

    if (!data) {
      throw new Error("Data not found");
    }

    const { form_id, to } = data;

    let destination = [to];

    if (to.includes("{{")) {
      if (to.includes("user")) {
        destination = activity.users.map((u) => u._id.toString());
      }

      if (to.includes("masterminds")) {
        destination = activity.masterminds.map((r) => r.user._id.toString());
      }
    }

    const users = await new User(conn)
      .model()
      .find({
        _id: { $in: destination },
      })
      .select({
        password: 0,
      });

    const form = await new Form(conn).model().findById(form_id);

    activity.interactions.push({
      activity_workflow_id,
      activity_step_id,
      form: form.toObject(),
      answers: users.map((u) => ({
        status: "idle",
        user: u,
        data: null,
      })),
      finished: false,
    });

    await activity.save();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default new QueueWrapper<TMessage>(handler).configure({
  name: "WorkInteraction",
  options: {
    queueName: NodeTypes.Interaction,
  },
});
