import mongoose, { Schema } from "mongoose";

export enum NodeTypes {
  ChangeStatus = "change_status",
  SendEmail = "send_email",
  Circle = "circle",
  SwapWorkflow = "swap_workflow",
  Interaction = "interaction",
  Evaluated = "evaluated",
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
}

export type IStep = {
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
);

export enum IWorkflowStatus {
  Draft = "draft",
  Published = "published",
}

export type IWorkflow = {
  _id: string;
  name: string;
  status: "draft" | "published";
  steps: IStep[];
  parent: string | null;
  viewport: { x: number; y: number; zoom: number };
  createdAt: string;
  updatedAt: string;
} & mongoose.Document;

export const schema: Schema = new Schema(
  {
    name: { type: String, required: true },
    version: { type: Number, default: 1, auto: true },
    status: { type: String, default: "draft", enum: ["draft", "published"] },
    parent: { type: Schema.Types.ObjectId, ref: "Workflow" },
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
).index({ name: 1, version: 1 }, { unique: true });

export default class Workflow {
  conn: mongoose.Connection;

  constructor(conn: mongoose.Connection) {
    this.conn = conn;
  }

  model() {
    return this.conn.model<IWorkflow>("Workflow", schema);
  }
}
