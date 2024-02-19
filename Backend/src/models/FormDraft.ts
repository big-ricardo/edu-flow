import mongoose, { Schema } from "mongoose";

export enum FieldTypes {
  Text = "text",
  Number = "number",
  Email = "email",
  Password = "password",
  Textarea = "textarea",
  Radio = "radio",
  Select = "select",
  MultiSelect = "multiselect",
  Date = "date",
  File = "file",
  Teachers = "teachers",
  Evaluated = "evaluated",
}

export enum IFormStatus {
  Draft = "draft",
  Published = "published",
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

export type IFormDraft = {
  _id: string;
  status: IFormStatus;
  parent: string;
  owner: string;
  fields: IField[];
  version: number;
  createdAt: string;
  updatedAt: string;
} & mongoose.Document;

export const schema: Schema = new Schema(
  {
    status: { type: String, required: true, enum: Object.values(IFormStatus) },
    parent: { type: Schema.Types.ObjectId, ref: "Form", required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    version: { type: Number, required: true, default: 1 },
    fields: [
      {
        id: { type: String, required: true },
        type: {
          type: String,
          required: true,
          enum: Object.values(FieldTypes),
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
  }
).index({ parent: 1, status: 1 });

export default class FormDraft {
  conn: mongoose.Connection;

  constructor(conn: mongoose.Connection) {
    this.conn = conn;
  }

  model() {
    return this.conn.model<IFormDraft>("FormDraft", schema);
  }
}
