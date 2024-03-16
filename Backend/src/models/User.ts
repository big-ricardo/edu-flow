import {
  Entity,
  Column,
  ObjectIdColumn,
  ObjectId,
  ManyToOne,
  OneToMany,
  ManyToMany,
} from "typeorm";
import { Institute } from "./Institute";
import { WorkflowDraft } from "./WorkflowDraft";
import { Comment } from "./Comment";
import { FormDraft } from "./FormDraft";
import { Answer } from "./Answer";
import { ActivityGuiding } from "./ActivityGuiding";
import { Activity } from "./Activity";

export enum IUserRoles {
  admin = "admin",
  student = "student",
  teacher = "teacher",
}

@Entity()
export class User {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  cpf: string;

  @Column()
  password: string;

  @Column({ default: true })
  active: boolean;

  @Column()
  matriculation: string;

  @Column("simple-array")
  roles: IUserRoles[];

  @ManyToOne((type) => Institute, (institute) => institute.users)
  institute: Institute;

  @Column({ nullable: true })
  university_degree: string | null;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @ManyToOne((type) => WorkflowDraft, (workflow) => workflow.owner)
  workflows: WorkflowDraft[];

  @OneToMany((type) => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany((type) => WorkflowDraft, (workflow) => workflow.owner)
  formDrafts: FormDraft[];

  @OneToMany((type) => Answer, (answer) => answer.user)
  answers: Answer[];

  @ManyToMany((type) => Activity, (activity) => activity.users)
  activities: Activity[];

  @OneToMany(
    (type) => ActivityGuiding,
    (activityGuiding) => activityGuiding.user
  )
  guiding: ActivityGuiding[];
}
