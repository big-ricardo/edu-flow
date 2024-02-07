export enum FieldTypes {
  text = "text",
  number = "number",
  email = "email",
  password = "password",
  textarea = "textarea",
  checkbox = "checkbox",
  radio = "radio",
  select = "select",
  date = "date",
  file = "file",
  teachers = "teachers",
}

export type IField = {
  id: string;
  label: string;
  type:
    | "text"
    | "number"
    | "email"
    | "password"
    | "textarea"
    | "checkbox"
    | "radio"
    | "select"
    | "date"
    | "file"
    | "evaluated"
    | "multiselect";
  required?: boolean;
  predefined: "teachers" | "students" | "institutions" | null;
  value?: string | null;
  visible: boolean;
  options?: { label: string; value: string }[] | null;
  system?: boolean;
};

type IForm = {
  _id: string;
  name: string;
  slug: string;
  status: "draft" | "published";
  type: "created" | "interaction" | "evaluated";
  period: { open?: string | null; close?: string | null };
  description: string;
  fields: IField[];
} & (
  | {
      type: "created";
      initial_status: string;
      workflow: string;
    }
  | {
      type: "interaction";
    }
  | {
      type: "evaluated";
    }
);

export default IForm;
