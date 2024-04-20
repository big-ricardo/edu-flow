import mongoose, { ObjectId, Schema, Types } from "mongoose";
import { IUser } from "./User";
import { IStatus } from "./Status";
import { IFormDraft, schema as schemaFormDraft } from "./FormDraft";
import { IStep, IWorkflowDraft } from "./WorkflowDraft";

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

export type IComment = {
  _id: string;
  user: IUserChild;
  content: string;
  viewed: mongoose.Types.ObjectId[];
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
} & mongoose.Document;

export type IUserChild = Pick<
  IUser,
  | "_id"
  | "name"
  | "email"
  | "matriculation"
  | "university_degree"
  | "institute"
  | "isExternal"
>;

export enum IActivityStepStatus {
  idle = "idle",
  inQueue = "in_queue",
  inProgress = "in_progress",
  finished = "finished",
  error = "error",
}

export type IActivityStep = {
  _id: ObjectId;
  step: ObjectId;
  status: IActivityStepStatus;
  data: object;
  interactions: IFormDraft[];
};

export type ActivityWorkflow = {
  _id: ObjectId;
  workflow_draft: IWorkflowDraft;
  steps: mongoose.Types.DocumentArray<IActivityStep>;
  finished: boolean;
};

export type IActivity = {
  _id: ObjectId;
  name: string;
  protocol: string;
  state: IActivityState;
  users: IUserChild[];
  form: mongoose.Types.ObjectId;
  form_draft: IFormDraft;
  masterminds: {
    accepted: IActivityAccepted;
    user: Pick<
      IUser,
      | "_id"
      | "name"
      | "email"
      | "matriculation"
      | "university_degree"
      | "institute"
    >;
  }[];
  sub_masterminds: Pick<
    IUser,
    | "_id"
    | "name"
    | "email"
    | "matriculation"
    | "university_degree"
    | "institute"
  >[];
  status: IStatus;
  comments: IComment[];
  workflows: mongoose.Types.DocumentArray<ActivityWorkflow>;
  description: string;
  createdAt: string;
  updatedAt: string;
} & mongoose.Document;

const userSchema = new Schema<IUserChild>({
  _id: {
    type: Schema.Types.ObjectId,
    required: () => !(this as IUserChild).isExternal,
    index: true,
  },
  isExternal: { type: Boolean, required: false },
  name: { type: String, required: true },
  email: { type: String, required: true },
  matriculation: { type: String, required: true },
  university_degree: { type: String, required: false },
  institute: { type: Object, required: true },
});

const commentSchema = new Schema<IComment>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    user: { type: Object, required: true },
    content: { type: String, required: true },
    viewed: [{ type: Schema.Types.ObjectId }],
    isEdited: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const statusSchema = new Schema<IStatus>({
  name: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["progress", "done", "canceled"],
  },
});

export const ActivityStepSchema = new Schema<IActivityStep>({
  _id: { type: Schema.Types.ObjectId, auto: true },
  step: { type: Schema.Types.ObjectId, required: true },
  status: {
    type: String,
    required: true,
    enum: Object.values(IActivityStepStatus),
    default: IActivityStepStatus.idle,
  },
  data: { type: Object, required: false, default: {} },
  interactions: [{ type: Object, required: false, default: [] }],
});

export const ActivityWorkflowSchema = new Schema<ActivityWorkflow>({
  _id: { type: Schema.Types.ObjectId, auto: true },
  workflow_draft: {
    type: Object,
    required: true,
  },
  steps: [{ type: ActivityStepSchema, required: false, default: [] }],
  finished: { type: Boolean, default: false },
});

export const schema: Schema = new Schema<IActivity>(
  {
    name: { type: String, required: true },
    form: { type: Schema.Types.ObjectId, ref: "Form", required: true },
    form_draft: { type: schemaFormDraft, required: true },
    protocol: { type: String, required: false, unique: true },
    description: { type: String, required: true },
    comments: [{ type: commentSchema, required: false, default: [] }],
    state: {
      type: String,
      required: true,
      enum: Object.values(IActivityState),
      default: IActivityState.created,
    },
    users: [{ type: userSchema, required: true }],
    masterminds: [
      {
        accepted: {
          type: String,
          enum: Object.values(IActivityAccepted),
          default: IActivityAccepted.pending,
        },
        user: userSchema,
      },
    ],
    sub_masterminds: [{ type: userSchema, required: false, default: [] }],
    status: { type: statusSchema, required: true },
    workflows: [
      {
        type: ActivityWorkflowSchema,
        required: false,
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
).pre<IActivity>("save", function (next) {
  if (!this.isNew) {
    return next();
  }
  const year = new Date().getFullYear();
  const timestamp = new Date().getTime().toString().slice(-5);
  this.protocol = `${year}${timestamp}`;
  next();
});

export default class Activity {
  conn: mongoose.Connection;

  constructor(conn: mongoose.Connection) {
    this.conn = conn;
  }

  model() {
    return this.conn.model<IActivity>("Activity", schema);
  }
}
