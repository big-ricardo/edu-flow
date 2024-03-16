import {
  Entity,
  Column,
  ObjectIdColumn,
  ObjectId,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Form } from "./Form";
import { User } from "./User";
import { Answer } from "./Answer";
import { FormField } from "./FormField";

export enum FieldTypes {
  Text = "text",
  Number = "number",
  Email = "email",
  Password = "password",
  Textarea = "textarea",
  Radio = "radio",
  Select = "select",
  MultiSelect = "multiselect",
  Date = "date",
  File = "file",
  Teachers = "teachers",
  Evaluated = "evaluated",
}

export enum IFormStatus {
  Draft = "draft",
  Published = "published",
}

@Entity()
export class FormDraft {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({ enum: IFormStatus, default: IFormStatus.Draft })
  status: string;

  @ManyToOne((type) => Form, (form) => form.drafts)
  parent: Form;

  @ManyToOne((type) => User, (user) => user.formDrafts)
  owner: User;

  @Column({ default: 1 })
  version: number;

  @ManyToOne((type) => FormField, { nullable: false })
  fields: FormField[];

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @OneToMany((type) => Answer, (answer) => answer.formDraft)
  answers: Answer[];
}
