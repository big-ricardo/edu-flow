import mongoose, { Schema } from "mongoose";

export enum FieldTypes {
  Text = "text",
  Number = "number",
  Email = "email",
  Password = "password",
  Textarea = "textarea",
  Checkbox = "checkbox",
  Radio = "radio",
  Select = "select",
  Date = "date",
  File = "file",
  Teachers = "teachers",
}

export enum FormStatus {
  Draft = "draft",
  Published = "published",
}

export enum FormType {
  Created = "created",
  Interaction = "interaction",
  Available = "available",
}

export type IField = {
  name: string;
  type: FieldTypes;
  required?: boolean;
  predefined?: "teachers" | "students" | "institution";
  visible: boolean;
  system?: boolean;
  options?: { label: string; value: string }[];
};

export type IForm = {
  _id: string;
  name: string;
  status: FormStatus;
  initial_status?: string;
  type: FormType;
  period?: { open: string; close: string };
  description: string;
  fields: IField[];
} & mongoose.Document;

export const schema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    status: { type: String, required: true, enum: ["draft", "published"] },
    initial_status: {
      type: Schema.Types.ObjectId,
      ref: "Status",
      default: null,
    },
    slug: { type: String, required: true, unique: true },
    type: {
      type: String,
      required: true,
      enum: ["created", "interaction", "available"],
    },
    period: { open: Date, close: Date },
    workflow: { type: Schema.Types.ObjectId, ref: "Workflow", default: null },
    description: { type: String, required: false, default: "" },
    fields: [
      {
        id: { type: String, required: true },
        type: {
          type: String,
          required: true,
          enum: [
            "text",
            "number",
            "email",
            "password",
            "textarea",
            "checkbox",
            "radio",
            "select",
            "date",
            "file",
            "multiselect",
            "evaluated",
          ],
        },
        weight: { type: Number, required: false },
        predefined: {
          type: String,
          required: false,
          enum: ["teachers", "students", "institutions"],
          default: null,
        },
        label: { type: String, required: false, default: "" },
        placeholder: { type: String, required: false, default: "" },
        value: { type: String, default: null },
        required: { type: Boolean, required: false },
        visible: { type: Boolean, required: false },
        system: { type: Boolean, required: false, default: false },
        options: {
          type: [
            {
              label: { type: String, required: true },
              value: { type: String, required: true },
            },
          ],
          required: false,
          default: null,
        },
      },
    ],
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
