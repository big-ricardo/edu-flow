import { Viewport, XYPosition } from "reactflow";

export enum NodeTypes {
  ChangeStatus = "change_status",
  SendEmail = "send_email",
  Circle = "circle",
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
);

export type IWorkflow = {
  _id: string;
  name: string;
  active: boolean;
  steps: IStep[];
  viewport: Viewport;
}