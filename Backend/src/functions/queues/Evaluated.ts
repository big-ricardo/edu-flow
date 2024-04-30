import QueueWrapper, {
  GenericMessage,
  QueueWrapperHandler,
} from "../../middlewares/queue";
import Activity from "../../models/client/Activity";
import Form from "../../models/client/Form";
import User, { IUser } from "../../models/client/User";
import { IEvaluated, NodeTypes } from "../../models/client/WorkflowDraft";

interface TMessage extends GenericMessage {}

const handler: QueueWrapperHandler<TMessage> = async (
  conn,
  messageQueue,
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

    const { data } = step as { data: IEvaluated };
    const { form_id, to, isDeferred } = data;

    let destinations: IUser[] | null = null;

    if (!isDeferred) {
      const destinationIds = to
        .map((to) => {
          if (to.includes("{{")) {
            if (to.includes("user")) {
              return activity.users.map((u) => u._id.toString());
            }

            if (to.includes("masterminds")) {
              return activity.masterminds.map((r) => r.user._id.toString());
            }
          }
          return to;
        })
        .flat();

      destinations = await new User(conn)
        .model()
        .find({
          _id: { $in: destinationIds },
        })
        .select({
          password: 0,
        });
    }

    const form = await new Form(conn).model().findById(form_id);

    activity.evaluations.push({
      activity_workflow_id,
      activity_step_id,
      form: form.toObject(),
      answers:
        destinations?.map((u) => ({
          status: "idle",
          user: u,
          data: null,
        })) ?? undefined,
      not_defined_board: destinations === null,
    });

    await activity.save();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default new QueueWrapper<TMessage>(handler).configure({
  name: "WorkEvaluated",
  options: {
    queueName: NodeTypes.Evaluated,
  },
});
