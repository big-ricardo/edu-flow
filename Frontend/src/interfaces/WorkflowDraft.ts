import { Viewport, XYPosition } from "reactflow";

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
  visible: boolean;
  waitForOne: boolean;
  conditional: Array<{
    field: string;
    value: string;
    operator: "==" | "!=" | ">" | "<" | ">=" | "<=" | "contains";
  }>;
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
  field_populate: [
    {
      key: string;
      value: string;
    }
  ];
}

export type IEvaluated = {
  name: string;
  visible: boolean;
  form_id: string;
} & (
  | {
      isDeferred: false;
    }
  | {
      isDeferred: true;
      to: Array<string>;
    }
);

export type IStep = {
  _id: string;
  id: string;
  name: string;
  visible: boolean;
  position: XYPosition;
  deletable?: boolean;
  next: {
    ["default-source"]: string;
    ["alternative-source"]?: string | null;
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

export type IWorkflowDraft = {
  _id: string;
  status: "draft" | "published";
  version: number;
  active: boolean;
  parent: string;
  steps: IStep[];
  viewport: Viewport;
  createdAt: string;
  owner: {
    _id: string;
    name: string;
  };
};

export default IWorkflowDraft;
