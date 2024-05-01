import QueueWrapper, {
  GenericMessage,
  QueueWrapperHandler,
} from "../../middlewares/queue";
import Activity from "../../models/client/Activity";
import { IEvaluated } from "../../models/client/WorkflowDraft";
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

    const activityWorkflow = activity.workflows.id(activity_workflow_id);

    if (!activityWorkflow) {
      throw new Error("Workflow not found");
    }

    const {
      workflow_draft: { steps },
    } = activityWorkflow;

    const activityStep = activityWorkflow.steps.id(activity_step_id);

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
    const { average } = data;

    const evaluationIndex = activity.evaluations.findIndex(
      (evaluation) =>
        evaluation.activity_step_id.toString() === activityStep._id.toString()
    );

    if (evaluationIndex === -1) {
      throw new Error("Evaluation not found");
    }

    const evaluation = activity.evaluations[evaluationIndex];

    const accGrade = evaluation.answers.reduce(
      (acc, answer) => acc + answer.grade,
      0
    );

    evaluation.final_grade = accGrade / evaluation.answers.length;
    evaluation.finished = true;

    const approved = evaluation.final_grade >= average;

    await sendNextQueue({
      conn,
      activity,
      context,
      path: approved ? "default-source" : "alternative-source",
    });

    await activity.save();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default new QueueWrapper<TMessage>(handler).configure({
  name: "WorkEvaluatedProcess",
  options: {
    queueName: "evaluation_process",
  },
});
