type IForm = {
  _id: string;
  name: string;
  slug: string;
  active: boolean;
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
);

export default IForm;
