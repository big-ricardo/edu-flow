import mongoose, { Schema, model } from "mongoose";

export interface IUniversity extends mongoose.Document {
  _id: string;
  name: string;
  acronym: string;
  active: boolean;
}

export const schema: Schema = new Schema(
  {
    name: { type: String, required: true },
    acronym: { type: String, required: true, unique: true },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default class University {
  conn: mongoose.Connection;

  constructor(conn: mongoose.Connection) {
    this.conn = conn;
  }

  model() {
    return this.conn.model<IUniversity>("University", schema);
  }
}
