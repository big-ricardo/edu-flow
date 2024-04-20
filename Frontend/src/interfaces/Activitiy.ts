import IComment from "./Comments";
import IForm from "./Form";
import IFormDraft from "./FormDraft";
import IStatus from "./Status";
import IUser from "./User";
import IWorkflowDraft from "./WorkflowDraft";

export enum IActivityState {
  finished = "finished",
  processing = "processing",
  committed = "committed",
  created = "created",
}

export enum IActivityStatus {
  active = "active",
  inactive = "inactive",
}

export enum IActivityAccepted {
  accepted = "accepted",
  rejected = "rejected",
  pending = "pending",
}

export type IUserChild = Omit<IUser, "password">

export enum IActivityStepStatus {
  idle = "idle",
  inQueue = "in_queue",
  inProgress = "in_progress",
  finished = "finished",
  error = "error",
}

export type IActivityStep = {
  _id: string;
  step: string;
  status: IActivityStepStatus;
  data: object;
  interactions: IFormDraft[];
};

export type ActivityWorkflow = {
  _id: string;
  workflow_draft: IWorkflowDraft;
  steps: Array<IActivityStep>;
  finished: boolean;
};

export type IActivity = {
  _id: string;
  name: string;
  protocol: string;
  state: IActivityState;
  users: IUserChild[];
  form: IForm;
  form_draft: IFormDraft;
  masterminds: {
    accepted: IActivityAccepted;
    user: IUserChild;
  }[];
  sub_masterminds: IUserChild[];
  status: IStatus;
  comments: IComment[];
  workflows:ActivityWorkflow[];
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default IActivity;