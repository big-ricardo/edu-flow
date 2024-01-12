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
  name: string;
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
    | "teachers";
  required?: boolean;
  visible: boolean;
  options?: { label: string; value: string }[];
};

export default interface IForm {
  _id: string;
  name: string;
  status: "draft" | "published";
  initial_status?: string;
  type: "created" | "interaction" | "available";
  period?: { open: string; close: string };
  description: string;
  fields: IField[];
}
