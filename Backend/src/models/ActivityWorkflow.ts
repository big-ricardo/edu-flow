import { Entity, Column, ObjectIdColumn, ObjectId, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Activity } from "./Activity";
import { WorkflowDraft } from "./WorkflowDraft";
import { ActivityWorkflowStep } from "./ActivityWorkflowStep";

export enum ActivityWorkflowStatus {
  inQueue = "in_queue",
  inProgress = "in_progress",
  done = "done",
  canceled = "canceled",
  error = "error",
}

@Entity()
export class ActivityWorkflow {
  @ObjectIdColumn()
  id: ObjectId;

  @ManyToOne((type) => WorkflowDraft, (workflowDraft) => workflowDraft.activities)
  workflow: WorkflowDraft;

  @ManyToOne((type) => Activity, (activity) => activity.workflows)
  activity: Activity;

  @Column({
    enum: ActivityWorkflowStatus,
    default: ActivityWorkflowStatus.inQueue,
  })
  status: ActivityWorkflowStatus;

  @OneToMany((type) => ActivityWorkflowStep, (step) => step.activityWorkflow)
  steps: ActivityWorkflowStep[];

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
