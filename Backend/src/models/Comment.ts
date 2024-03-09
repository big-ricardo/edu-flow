import mongoose, { Schema } from "mongoose";

export type IComment = {
  _id: string;
  activity: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  content: string;
  viewed: mongoose.Types.ObjectId[];
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
} & mongoose.Document;

export const schema: Schema = new Schema<IComment>(
  {
    activity: { type: Schema.Types.ObjectId, ref: "Activity", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    viewed: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    isEdited: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export default class Comment {
  conn: mongoose.Connection;

  constructor(conn: mongoose.Connection) {
    this.conn = conn;
  }

  model() {
    return this.conn.model<IComment>("Comment", schema);
  }
}
