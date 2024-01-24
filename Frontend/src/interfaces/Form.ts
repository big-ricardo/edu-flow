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
    | "multiselect";
  required?: boolean;
  predefined: "teachers" | "students" | "institutions" | null;
  value: string | null;
  visible: boolean;
  options:
    | { label: string; value: string }[]
    | { label: string; options: { label: string; value: string }[] }[];
  system?: boolean;
};

export default interface IForm {
  _id: string;
  name: string;
  slug: string;
  status: "draft" | "published";
  initial_status?: string;
  type: "created" | "interaction" | "available";
  period: { open?: string | null; close?: string | null };
  description: string;
  fields: IField[];
}
