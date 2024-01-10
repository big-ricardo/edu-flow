import mongoose, { Schema } from "mongoose";

export interface IEmail extends mongoose.Document {
  _id: string;
  slug: string;
  subject: string;
  jsonTemplate: JSON;
  htmlTemplate: string;
}

export const schema: Schema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    htmlTemplate: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default class Email {
  conn: mongoose.Connection;

  constructor(conn: mongoose.Connection) {
    this.conn = conn;
  }

  model() {
    return this.conn.model<IEmail>("Email", schema);
  }
}
