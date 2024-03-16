import {
  Entity,
  Column,
  ObjectIdColumn,
  ObjectId,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { University } from "./University";
import { User } from "./User";

@Entity()
export class Institute {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  name: string;

  @Column({ unique: true })
  acronym: string;

  @Column({ default: true })
  active: boolean;

  @ManyToOne((type) => University, (university) => university.institutes)
  university: University;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @OneToMany((type) => User, (user) => user.institute)
  users: User[];
}
