import { Entity, Column, ObjectIdColumn, ObjectId, ManyToOne } from "typeorm";
import { Activity } from "./Activity";

@Entity()
export class Status {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({ unique: true })
  name: string;

  @Column({
    type: "enum",
    enum: ["progress", "done", "canceled"],
    default: "progress", // Defina o valor padrão conforme necessário
  })
  type: string;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @ManyToOne(type => Activity, activity => activity.status)
  activities: Activity[];
}
