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
  describe?: string | null;
  options?: { label: string; value: string }[] | null;
  system?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
};

export type IFormStatus = "draft" | "published";

type IFormDraft = {
  _id: string;
  owner: {
    _id: string;
    name: string;
  };
  status: IFormStatus;
  version: number;
  createdAt: string;
  parent: string;
  fields: IField[];
};

export default IFormDraft;
