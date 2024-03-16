import { Entity, Column, ObjectIdColumn, ObjectId, ManyToOne } from "typeorm";
import { User } from "./User";
import { Activity } from "./Activity";

export enum ActivityAccepted {
  accepted = "accepted",
  rejected = "rejected",
  pending = "pending",
}

@Entity()
export class ActivityGuiding {
  @ObjectIdColumn()
  id: ObjectId;

  @ManyToOne((type) => User, (user) => user.guiding)
  user: User;

  @ManyToOne((type) => Activity, (activity) => activity.guiding)
  activity: Activity;

  @Column({ enum: ActivityAccepted, default: ActivityAccepted.pending })
  status: ActivityAccepted;
}
