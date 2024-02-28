import mongoose, { Schema } from "mongoose";

export enum IFormType {
  Created = "created",
  Interaction = "interaction",
  Evaluated = "evaluated",
}

export type IForm = {
  _id: string;
  name: string;
  initial_status?: string;
  type: IFormType;
  period?: { open: string; close: string };
  active: boolean;
  description: string;
  published: string | null;
} & mongoose.Document;

export const schema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    initial_status: {
      type: Schema.Types.ObjectId,
      ref: "Status",
      default: null,
    },
    slug: { type: String, required: true, unique: true },
    type: {
      type: String,
      required: true,
      enum: Object.values(IFormType),
    },
    active: { type: Boolean, required: true, default: true },
    period: { open: Date, close: Date },
    workflow: { type: Schema.Types.ObjectId, ref: "Workflow", default: null },
    description: { type: String, required: false, default: "" },
    published: { type: Schema.Types.ObjectId, ref: "FormDraft", default: null },
  },
  {
    timestamps: true,
  },
).index({ slug: 1, status: 1, "period.open": 1, "period.close": 1 });

export default class Form {
  conn: mongoose.Connection;

  constructor(conn: mongoose.Connection) {
    this.conn = conn;
  }

  model() {
    return this.conn.model<IForm>("Form", schema);
  }
}
