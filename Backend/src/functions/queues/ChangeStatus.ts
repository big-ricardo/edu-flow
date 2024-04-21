import QueueWrapper, {
  GenericMessage,
  QueueWrapperHandler,
} from "../../middlewares/queue";
import Activity from "../../models/client/Activity";
import Status from "../../models/client/Status";
import { IChangeStatus, NodeTypes } from "../../models/client/WorkflowDraft";
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

    const { data } = step as { data: IChangeStatus };

    if (!data) {
      throw new Error("Data not found");
    }

    const { status_id } = data;

    const status = await new Status(conn).model().findById(status_id);

    if (!status) {
      throw new Error("Status not found");
    }

    activity.status = status;

    await sendNextQueue({
      conn,
      activity,
      context,
    });

    await activity.save();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default new QueueWrapper<TMessage>(handler).configure({
  name: "WorkChangeStatus",
  options: {
    queueName: NodeTypes.ChangeStatus,
  },
});
