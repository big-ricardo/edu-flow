import mongoose, { ObjectId, Schema } from "mongoose";

export enum NodeTypes {
  ChangeStatus = "change_status",
  SendEmail = "send_email",
  Circle = "circle",
  SwapWorkflow = "swap_workflow",
  Interaction = "interaction",
  Evaluated = "evaluated",
  WebRequest = "web_request",
}

export interface ISendEmail {
  name: string;
  email_id: string;
  to: string[];
  visible: boolean;
}

export interface IChangeStatus {
  name: string;
  status_id: string;
  visible: boolean;
}

export interface ICircle {
  name: string;
  visible: false;
}

export interface ISwapWorkflow {
  name: string;
  workflow_id: string;
  visible: false;
}

export interface IInteraction {
  name: string;
  form_id: string;
  to: string;
  visible: true;
  conditional: [
    {
      field: string;
      value: string;
      operator: "eq" | "ne" | "gt" | "lt" | "gte" | "lte" | "in";
    }
  ];
}

export interface IEvaluated {
  name: string;
  visible: false;
  form_id: string;
  isDeferred: boolean;
  average: number;
  to: string[];
  notUseGrade: boolean;
  weight: number;
}

export interface IWebRequest {
  name: string;
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers: Array<{
    key: string;
    value: string;
  }>;
  body: string;
  visible: false;
  field_populate?: [
    {
      key: string;
      value: string;
    }
  ];
}

export type IStep = {
  _id: ObjectId;
  id: string;
  visible: boolean;
  position: { x: number; y: number };
  next: {
    ["default-source"]: string | null;
    ["alternative-source"]: string | null;
  };
} & (
  | {
      type: NodeTypes.SendEmail;
      data: ISendEmail;
    }
  | {
      type: NodeTypes.ChangeStatus;
      data: IChangeStatus;
    }
  | {
      type: NodeTypes.Circle;
      data: ICircle;
    }
  | {
      type: NodeTypes.SwapWorkflow;
      data: ISwapWorkflow;
    }
  | {
      type: NodeTypes.Interaction;
      data: IInteraction;
    }
  | {
      type: NodeTypes.Evaluated;
      data: IEvaluated;
    }
  | {
      type: NodeTypes.WebRequest;
      data: IWebRequest;
    }
);

export enum IWorkflowDraftStatus {
  Draft = "draft",
  Published = "published",
}

export type IWorkflowDraft = {
  _id: string;
  name: string;
  status: "draft" | "published";
  owner: Schema.Types.ObjectId | string;
  steps: IStep[];
  parent: Schema.Types.ObjectId | string | null;
  viewport: { x: number; y: number; zoom: number };
  createdAt: string;
  updatedAt: string;
  version: number;
} & mongoose.Document;

export const schemaBase = new Schema<IWorkflowDraft>(
  {
    version: { type: Number, default: 1, auto: true },
    status: { type: String, default: "draft", enum: ["draft", "published"] },
    parent: { type: Schema.Types.ObjectId, ref: "Workflow" },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    viewport: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      zoom: { type: Number, default: 1 },
    },
    steps: [
      {
        _id: { type: Schema.Types.ObjectId, auto: true },
        id: { type: String, required: true },
        type: {
          type: String,
          enum: Object.values(NodeTypes),
        },
        position: {
          x: { type: Number, required: true },
          y: { type: Number, required: true },
        },
        deletable: { type: Boolean },
        data: {
          type: Object,
          required: true,
        },
        next: {
          ["default-source"]: {
            type: String,
            default: null,
          },
          ["alternative-source"]: {
            type: String,
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const schema = schemaBase.clone();

schema.index({ parent: 1, version: 1 }, { unique: true });

export default class WorkflowDraft {
  conn: mongoose.Connection;

  constructor(conn: mongoose.Connection) {
    this.conn = conn;
  }

  model() {
    return this.conn.model<IWorkflowDraft>("WorkflowDraft", schema);
  }
}
