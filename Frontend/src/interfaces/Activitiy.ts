import { IAnswer } from "./Answer";
import IFormDraft, { IField } from "./FormDraft";
import IUser from "./User";

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
  masterminds: string[];
  sub_masterminds: string[];
  createdAt: string;
}

export interface IActivityDetails
  extends Omit<
    IActivity,
    "users" | "status" | "masterminds" | "sub_masterminds"
  > {
  status: {
    _id: string;
    name: string;
  };
  users: Pick<IUser, "_id" | "name" | "email" | "matriculation">[];
  masterminds: {
    accepted: boolean;
    user: Pick<IUser, "_id" | "name" | "email" | "matriculation">;
  }[];
  sub_masterminds: {
    accepted: boolean;
    user: Pick<IUser, "_id" | "name" | "email" | "matriculation">;
  }[];
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
