import { Entity, Column, ObjectIdColumn, ObjectId } from "typeorm";

@Entity()
export class Workflow {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  published: string | null;

  @Column({ default: false })
  active: boolean;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}
