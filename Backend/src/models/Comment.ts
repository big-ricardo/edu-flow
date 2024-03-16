import { Entity, Column, ObjectIdColumn, ObjectId, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Activity } from "./Activity";
import { User } from "./User";

@Entity()
export class Comment {
    @ObjectIdColumn()
    id: ObjectId;

    @ManyToOne(type => Activity, activity => activity.comments)
    activity: Activity;

    @ManyToOne(type => User, user => user.comments)
    user: User;

    @Column()
    content: string;

    @ManyToMany(type => User)
    @JoinTable()
    viewed: User[];

    @Column({ default: false })
    isEdited: boolean;

    @Column({ default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column({ default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date;
}
