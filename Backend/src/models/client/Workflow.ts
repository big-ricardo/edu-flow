import mongoose, { Schema } from "mongoose";

export type IWorkflow = {
  _id: string;
  name: string;
  active: boolean;
  published: string;
  createdAt: string;
  updatedAt: string;
} & mongoose.Document;

export const schema: Schema = new Schema(
  {
    name: { type: String, required: true },
    published: {
      type: Schema.Types.ObjectId,
      ref: "WorkflowDraft",
      default: null,
    },
    active: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
).index({ name: 1, version: 1 }, { unique: true });

export default class Workflow {
  conn: mongoose.Connection;

  constructor(conn: mongoose.Connection) {
    this.conn = conn;
  }

  model() {
    return this.conn.model<IWorkflow>("Workflow", schema);
  }
}
