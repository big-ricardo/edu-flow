import mongoose, { Schema } from "mongoose";

export enum IActivityState {
  finished = "finished",
  processing = "processing",
  created = "created",
}

export enum IActivityStatus {
  active = "active",
  inactive = "inactive",
}

export type IActivity = {
  _id: string;
  name: string;
  protocol: string;
  state: IActivityState;
  users: mongoose.Types.ObjectId[];
  form: mongoose.Types.ObjectId;
  masterminds: {
    accepted: boolean;
    user: mongoose.Types.ObjectId;
  }[];
  status: mongoose.Types.ObjectId;
  workflows: {
    _id: mongoose.Types.ObjectId;
    workflow_draft: mongoose.Types.ObjectId;
    finished: boolean;
  }[];
  description: string;
  createdAt: string;
  updatedAt: string;
} & mongoose.Document;

export const schema: Schema = new Schema<IActivity>(
  {
    name: { type: String, required: true },
    form: { type: Schema.Types.ObjectId, ref: "Form", required: true },
    protocol: { type: String, required: false, unique: true },
    description: { type: String, required: true },
    state: {
      type: String,
      required: true,
      enum: Object.values(IActivityState),
      default: IActivityState.created,
    },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }, { required: true }],
    masterminds: [
      {
        accepted: { type: Boolean, default: false },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      },
    ],
    status: { type: Schema.Types.ObjectId, ref: "Status", required: true },
    workflows: [
      {
        _id: { type: Schema.Types.ObjectId, auto: true },
        workflow_draft: { type: Schema.Types.ObjectId, ref: "WorkflowDraft" },
        finished: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  }
)
  .pre<IActivity>("save", function (next) {
    if (!this.isNew) {
      next();
    }
    const year = new Date().getFullYear();
    this.protocol = `${year}${Math.floor(Math.random() * 100000)}`;
    next();
  })
  .index({ name: 1, state: 1 }, { unique: true });

export default class Activity {
  conn: mongoose.Connection;

  constructor(conn: mongoose.Connection) {
    this.conn = conn;
  }

  model() {
    return this.conn.model<IActivity>("Activity", schema);
  }
}
