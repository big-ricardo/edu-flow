import mongoose, { Schema } from "mongoose";
import { IField } from "./FormDraft";

export type IAnswer = {
  _id: string;
  user: string;
  activity: string | null;
  submitted: boolean;
  form: string;
  data: {
    [key: string]: IField["value"];
  };
  createdAt: string;
  updatedAt: string;
} & mongoose.Document;

export const schema: Schema<IAnswer> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    activity: {
      type: Schema.Types.ObjectId,
      required: false,
      default: null,
    },
    submitted: { type: Boolean, default: false },
    form: {
      type: Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },
    data: { type: Object, required: true },
  },
  {
    timestamps: true,
  }
).index({ user: 1, form: 1 }, { unique: false });

export default class Answer {
  conn: mongoose.Connection;

  constructor(conn: mongoose.Connection) {
    this.conn = conn;
  }

  model() {
    return this.conn.model<IAnswer>("Answer", schema);
  }
}
