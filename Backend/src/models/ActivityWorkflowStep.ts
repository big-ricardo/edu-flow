import { Entity, Column, ObjectIdColumn, ObjectId, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Activity } from "./Activity";
import { WorkflowDraft } from "./WorkflowDraft";
import { Answer } from "./Answer";
import { ActivityWorkflow } from "./ActivityWorkflow";
import { WorkflowDraftStep } from "./WorkflowDraftStep";

export enum ActivityStepStatus {
    idle = "idle",
    inQueue = "in_queue",
    inProgress = "in_progress",
    finished = "finished",
    error = "error",
}

@Entity()
export class ActivityWorkflowStep {
    @ObjectIdColumn()
    id: ObjectId;

    @ManyToOne(type => ActivityWorkflow, activityWorkflow => activityWorkflow.steps)
    activityWorkflow: ActivityWorkflow;

    @ManyToOne(type => Activity, activity => activity.activityWorkflows)
    activity: Activity;

    @Column()
    activity_workflow: string;

    @ManyToOne(type => WorkflowDraft, workflowDraft => workflowDraft.activityWorkflows)
    workflowDraft: WorkflowDraft;

    @ManyToOne(type => WorkflowDraftStep, step => step.activityWorkflows)
    step: WorkflowDraftStep;

    @Column({ default: ActivityStepStatus.idle })
    status: ActivityStepStatus;

    @ManyToMany(type => Answer)
    @JoinTable()
    answers: Answer[];

    @Column({ type: "json" })
    data: object;

    @Column({ default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column({ default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    // You may add other methods or hooks here as needed
}
