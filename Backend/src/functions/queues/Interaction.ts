import QueueWrapper, {
  GenericMessage,
  QueueWrapperHandler,
} from "../../middlewares/queue";
import { IInteraction, NodeTypes } from "../../models/client/WorkflowDraft";
import ActivityRepository from "../../repositories/Activity";
import FormRepository from "../../repositories/Form";
import UserRepository from "../../repositories/User";
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

    const activityRepository = new ActivityRepository(conn);
    const formRepository = new FormRepository(conn);
    const userRepository = new UserRepository(conn);

    const activity = await activityRepository.findById({ id: activity_id });

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

    const users = await userRepository.find({
      where: { _id: { $in: destination } },
      select: {
        _id: 1,
        name: 1,
        email: 1,
        matriculation: 1,
        university_degree: 1,
        institute: 1,
      },
    });

    const form = await formRepository.findById({ id: form_id });

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
