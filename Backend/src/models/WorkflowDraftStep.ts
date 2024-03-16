import {
  Entity,
  Column,
  ObjectId,
  ObjectIdColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { WorkflowDraft } from "./WorkflowDraft";
import { ActivityWorkflowStep } from "./ActivityWorkflowStep";

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

@Entity()
export class WorkflowDraftStep {
  @ObjectIdColumn()
  id: ObjectId;

  @ManyToOne((type) => WorkflowDraft, (workflowDraft) => workflowDraft.steps)
  workflowDraft: WorkflowDraft;

  @Column()
  visible: boolean;

  @Column()
  position: { x: number; y: number };

  @Column({ nullable: true, type: "json" })
  next: {
    ["default-source"]: string | null;
    ["alternative-source"]: string | null;
  };

  @Column({ enum: NodeTypes })
  type: NodeTypes;

  @Column({ type: "json", nullable: false })
  data: ISendEmail | IChangeStatus | ICircle | ISwapWorkflow | IInteraction;

  @OneToMany(
    (type) => ActivityWorkflowStep,
    (activityWorkflowStep) => activityWorkflowStep.step
  )
  activityWorkflows: WorkflowDraftStep[];
}
