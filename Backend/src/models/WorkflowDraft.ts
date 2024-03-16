import {
  Entity,
  Column,
  ObjectIdColumn,
  ObjectId,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { ActivityWorkflow } from "./ActivityWorkflow";
import { WorkflowDraftStep } from "./WorkflowDraftStep";

@Entity()
export class WorkflowDraft {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({ default: 1 })
  version: number;

  @Column({ default: "draft", enum: ["draft", "published"] })
  status: "draft" | "published";

  @ManyToOne((type) => WorkflowDraft, { nullable: true })
  parent: WorkflowDraft | null;

  @ManyToOne((type) => User, (user) => user.workflows)
  owner: User;

  @Column({ type: "json" })
  viewport: { x: number; y: number; zoom: number };

  @OneToMany((type) => WorkflowDraftStep, (step) => step.workflowDraft)
  steps: WorkflowDraftStep[];

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @ManyToOne((type) => ActivityWorkflow, (activity) => activity.workflow)
  activities: ActivityWorkflow[];

  @OneToMany((type) => ActivityWorkflow, (activity) => activity.workflow)
  activityWorkflows: ActivityWorkflow[];
}
