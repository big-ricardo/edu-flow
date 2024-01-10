import mongoose, { Schema } from "mongoose";

export interface IStatus extends mongoose.Document {
  _id: string;
  name: string;
  type: "progress" | "done" | "canceled";
}

export const schema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    type: {
      type: String,
      required: true,
      enum: ["progress", "done", "canceled"],
    },
  },
  {
    timestamps: true,
  }
);

export default class Status {
  conn: mongoose.Connection;

  constructor(conn: mongoose.Connection) {
    this.conn = conn;
  }

  model() {
    return this.conn.model<IStatus>("Status", schema);
  }
}
