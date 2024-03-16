import {
  Entity,
  Column,
  ObjectIdColumn,
  ObjectId,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { FormField } from "./FormField";
import { Answer } from "./Answer";

@Entity()
export class AnswerField {
  @ObjectIdColumn()
  id: ObjectId;

  @ManyToOne((type) => FormField, (formField) => formField.answers)
  formField: FormField;

  @ManyToOne((type) => Answer, (answer) => answer.fields)
  answer: Answer;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}
