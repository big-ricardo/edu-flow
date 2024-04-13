import { Connection, ObjectId } from "mongoose";
import { NodeTypes } from "../models/WorkflowDraft";
import { sendToQueue } from "./sbusOutputs";
import { InvocationContext } from "@azure/functions";
import Activity, {
  IActivityState,
  IActivityStepStatus,
} from "../models/Activity";

export default async function sendNextQueue({
  conn,
  activity_id,
  activity_step_id,
  context,
  path = "default-source",
}: {
  conn: Connection;
  activity_id: string;
  activity_step_id: string;
  context: InvocationContext;
  path?: "default-source" | "alternative-source";
}): Promise<void> {
  const activity = await new Activity(conn).model().findById(activity_id);

  const activityWorkflow = activity.workflows.find(
    (workflow) => !workflow.finished
  );

  const actualActivityStep = activityWorkflow.steps.find(
    (step) => step._id.toString() === activity_step_id.toString()
  );

  if (!actualActivityStep) {
    throw new Error("Step not found");
  }

  const nextStep = activityWorkflow.workflow_draft.steps.find(
    (step) =>
      step._id.toString() === actualActivityStep.step.next["default-source"]
  );

  if (nextStep) {
    const newActivityStep = await new Activity(conn).model().findByIdAndUpdate(
      activity_step_id,
      {
        $push: {
          steps: {
            step: nextStep._id,
            status: IActivityStepStatus.idle,
          },
        },
      },
      { new: true }
    );

    sendToQueue({
      context,
      conn,
      message: {
        activity_step_id: newActivityStep._id,
        step_id: nextStep._id,
        activity_id,
      },
      queueName: NodeTypes[NodeTypes[nextStep.type]],
    });
  } else {
    const activity = await new Activity(conn).model().findById(activity_id);
    for (const exec of activity.workflows) {
      if (exec._id === activityWorkflow._id) {
        exec.finished = true;
      }
      activity.state = IActivityState.finished;
      await activity.save();
    }
  }
}
