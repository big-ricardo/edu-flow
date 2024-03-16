import {
  Entity,
  Column,
  ObjectIdColumn,
  ObjectId,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { Activity } from "./Activity";
import { FormDraft } from "./FormDraft";
import { AnswerField } from "./AnswerField";

@Entity()
export class Answer {
  @ObjectIdColumn()
  id: ObjectId;

  @ManyToOne((type) => User, (user) => user.answers)
  user: User;

  @ManyToOne((type) => Activity, (activity) => activity.answers)
  activity: Activity;

  @Column({ default: false })
  submitted: boolean;

  @ManyToOne((type) => FormDraft, (formDraft) => formDraft.answers)
  formDraft: FormDraft;

  @OneToMany((type) => AnswerField, (answerField) => answerField.answer)
  fields: AnswerField[];

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}
