import mongoose, { Schema } from "mongoose";

export enum IActivityStepStatus {
  idle = "idle",
  inQueue = "in_queue",
  inProgress = "in_progress",
  finished = "finished",
  error = "error",
}

export type IActivity = {
  _id: string;
  activity: mongoose.Types.ObjectId;
  activity_workflow: mongoose.Types.ObjectId;
  workflow_draft: mongoose.Types.ObjectId;
  step: mongoose.Types.ObjectId;
  status: IActivityStepStatus;
  data: object;
  answers: mongoose.Types.ObjectId[];
  createdAt: string;
  updatedAt: string;
} & mongoose.Document;

export const schema: Schema = new Schema(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(IActivityStepStatus),
      default: IActivityStepStatus.idle,
    },
    activity: { type: Schema.Types.ObjectId, ref: "Activity", required: true },
    activity_workflow: {
      type: Schema.Types.ObjectId,
      ref: "Activity.workflows",
      required: true,
    },
    workflow_draft: {
      type: Schema.Types.ObjectId,
      ref: "WorkflowDraft",
      required: true,
    },
    step: {
      type: Schema.Types.ObjectId,
      ref: "WorkflowDraft.steps",
      required: true,
    },
    answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
    data: { type: Object, required: true },
  },
  {
    timestamps: true,
  }
).index({ name: 1, version: 1 }, { unique: true });

export default class Activity {
  conn: mongoose.Connection;

  constructor(conn: mongoose.Connection) {
    this.conn = conn;
  }

  model() {
    return this.conn.model<IActivity>("ActivityWorkflow", schema);
  }
}
