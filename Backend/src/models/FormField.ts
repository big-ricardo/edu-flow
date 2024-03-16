import { Entity, Column, ObjectId, ObjectIdColumn, OneToMany } from "typeorm";
import { AnswerField } from "./AnswerField";

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

export type IField = {
  id: string;
  type: FieldTypes;
  required?: boolean;
  predefined?: "teachers" | "students" | "institution";
  visible: boolean;
  system?: boolean;
  options?:
    | { label: string; value: string }[]
    | { label: string; options: { label: string; value: string }[] }[];
  validation?: { min?: number; max?: number; pattern?: string };
  describe?: string;
};

@Entity()
export class FormField {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({ default: "draft", enum: Object.values(FieldTypes) })
  type: FieldTypes;

  @Column({ nullable: true })
  required: boolean;

  @Column({ nullable: true })
  predefined: string;

  @Column()
  visible: boolean;

  @Column({ nullable: true })
  system: boolean;

  @Column({ type: "json", nullable: true })
  options:
    | { label: string; value: string }[]
    | { label: string; options: { label: string; value: string }[] }[];

  @Column({ type: "json", nullable: true })
  validation: { min?: number; max?: number; pattern?: string };

  @Column({ nullable: true })
  describe: string;

  @OneToMany((type) => AnswerField, (answerField) => answerField.formField)
  answers: AnswerField[];

  constructor(data: IField) {
    this.id = new ObjectId();
    this.type = data.type;
    this.required = data.required;
    this.predefined = data.predefined;
    this.visible = data.visible;
    this.system = data.system;
    this.options = data.options;
    this.validation = data.validation;
    this.describe = data.describe;
  }
}
