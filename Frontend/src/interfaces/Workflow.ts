import { Viewport, XYPosition } from "reactflow";

export enum NodeTypes {
  ChangeStatus = "change_status",
  SendEmail = "send_email",
  Circle = "circle",
  SwapWorkflow = "swap_workflow",
  Interaction = "interaction",
}

export interface ISendEmail {
  name: string;
  email: string;
  to: string[];
  visible: boolean;
}

export interface IChangeStatus {
  name: string;
  status: string;
  visible: boolean;
}

export interface ICircle {
  name: string;
  active: boolean;
  visible: false;
}

export interface IInteraction {
  name: string;
  form: string;
  to: string;
  visible: true;
}

export type IStep = {
  id: string;
  name: string;
  visible: boolean;
  next_step_id: string | null;
  position: XYPosition;
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
      type: NodeTypes.Interaction;
      data: IInteraction;
    }
);

export type IWorkflow = {
  _id: string;
  name: string;
  status: "draft" | "published";
  version: number;
  active: boolean;
  parent: string;
  steps: IStep[];
  viewport: Viewport;
};
