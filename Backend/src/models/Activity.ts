import {
  Entity,
  Column,
  ObjectIdColumn,
  ObjectId,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Form } from "./Form";
import { User } from "./User";
import { Status } from "./Status";
import { Comment } from "./Comment";
import { Answer } from "./Answer";
import { ActivityGuiding } from "./ActivityGuiding";
import { ActivityWorkflow } from "./ActivityWorkflow";

export enum ActivityState {
  finished = "finished",
  processing = "processing",
  committed = "committed",
  created = "created",
}

export enum ActivityAccepted {
  accepted = "accepted",
  rejected = "rejected",
  pending = "pending",
}

@Entity()
export class Activity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @ManyToOne((type) => Form, (form) => form.activities)
  form: Form;

  @Column()
  protocol: string;

  @Column()
  description: string;

  @Column()
  state: ActivityState;

  @ManyToMany((type) => User, (user) => user.activities)
  @JoinTable()
  users: string[];

  @OneToMany(
    (type) => ActivityGuiding,
    (activityGuiding) => activityGuiding.activity
  )
  guiding: ActivityGuiding[];

  @Column("simple-array", { nullable: true })
  sub_masterminds: string[];

  @ManyToOne((type) => Status, (status) => status.activities)
  status: Status;

  @OneToMany((type) => Comment, (comment) => comment.activity)
  comments: Comment[];

  @OneToMany(
    (type) => ActivityWorkflow,
    (activityWorkflow) => activityWorkflow.activity
  )
  workflows: ActivityWorkflow[];

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @OneToMany((type) => Answer, (answer) => answer.activity)
  answers: Answer[];

  @OneToMany(
    (type) => ActivityWorkflow,
    (activityWorkflow) => activityWorkflow.activity
  )
  activityWorkflows: ActivityWorkflow[];
}
