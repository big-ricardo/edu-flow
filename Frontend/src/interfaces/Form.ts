type IForm = {
  _id: string;
  name: string;
  slug: string;
  status: "draft" | "published";
  type: "created" | "interaction" | "evaluated";
  period: { open?: string | null; close?: string | null };
  description: string;
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
