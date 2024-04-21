import mongoose, { ObjectId, Schema } from "mongoose";

export enum IFormType {
  Created = "created",
  Interaction = "interaction",
  Evaluated = "evaluated",
}

export type IForm = {
  _id: string;
  name: string;
  slug: string;
  initial_status: ObjectId | null;
  type: IFormType;
  period?: { open: string; close: string };
  active: boolean;
  description: string;
  published: ObjectId | null;
  institute: ObjectId | null;
  workflow: ObjectId | null;
} & mongoose.Document;

export const schema = new Schema<IForm>(
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
    institute: { type: Schema.Types.ObjectId, ref: "Institute", default: null },
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
