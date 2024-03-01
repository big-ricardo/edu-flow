import { IAnswer } from "./Answer";
import IFormDraft, { IField } from "./FormDraft";

export enum IActivityState {
  finished = "finished",
  processing = "processing",
  created = "created",
}

export default interface IActivity {
  _id: string;
  name: string;
  description: string;
  state: IActivityState;
  status: string;
  protocol: string;
  users: string[];
  createdAt: string;
}

export interface IActivityDetails extends Omit<IActivity, "users" | "status"> {
  users: {
    _id: string;
    name: string;
    matriculation: string;
    email: string;
  }[];
  status: {
    _id: string;
    name: string;
  };
  extra_fields: Omit<IAnswer, "user" | "form_draft"> & {
    form_draft: Pick<IFormDraft, "_id"> & {
      fields: (Omit<IField, "value"> &
        (
          | {
              predefined: null;
              value: string;
            }
          | {
              predefined: "student";
              value: {
                _id: string;
                name: string;
                matriculation: string;
                email: string;
              };
            }
        ))[];
    };
  };
}
