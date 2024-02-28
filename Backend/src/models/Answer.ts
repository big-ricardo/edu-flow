import mongoose, { Schema } from "mongoose";

export type IActivity = {
  _id: string;

  createdAt: string;
  updatedAt: string;
} & mongoose.Document;

export const schema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    activity: { type: Schema.Types.ObjectId, ref: "Activity", required: true },
    submitted: { type: Boolean, default: false },
    form_draft: {
      type: Schema.Types.ObjectId,
      ref: "FormDraft",
      required: true,
    },
    data: { type: Object, required: true },
  },
  {
    timestamps: true,
  }
).index({ user: 1, activity: 1, form_draft: 1 }, { unique: true });

export default class Answer {
  conn: mongoose.Connection;

  constructor(conn: mongoose.Connection) {
    this.conn = conn;
  }

  model() {
    return this.conn.model<IActivity>("Answer", schema);
  }
}
