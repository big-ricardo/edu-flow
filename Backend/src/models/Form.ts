import { Entity, Column, ObjectIdColumn, ObjectId, ManyToOne, OneToMany } from "typeorm";
import { Status } from "./Status";
import { Workflow } from "./Workflow";
import { FormDraft } from "./FormDraft";
import { Activity } from "./Activity";

@Entity()
export class Form {
    @ObjectIdColumn()
    id: ObjectId;

    @Column({ unique: true })
    name: string;

    @ManyToOne(type => Status, { nullable: true })
    initial_status: Status | null;

    @Column()
    slug: string;

    @Column()
    type: string;

    @Column({ default: true })
    active: boolean;

    @Column({ type: "json", nullable: true })
    period: { open: Date; close: Date } | null;

    @ManyToOne(type => Workflow, { nullable: true })
    workflow: Workflow | null;

    @Column({ default: "" })
    description: string;

    @Column({ nullable: true })
    published: string | null;

    @Column({ default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column({ default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    @OneToMany(type => FormDraft, formDraft => formDraft.parent)
    drafts: FormDraft[];

    @ManyToOne(type => Activity, activity => activity.form)
    activities: Activity[];

    // You may add other methods or hooks here as needed
}
