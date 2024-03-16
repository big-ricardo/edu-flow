import { Entity, Column, ObjectIdColumn, ObjectId, OneToMany } from "typeorm";
import { Institute } from "./Institute";

@Entity()
export class University {
    @ObjectIdColumn()
    id: ObjectId;

    @Column()
    name: string;

    @Column({ unique: true })
    acronym: string;

    @Column({ default: true })
    active: boolean;

    @Column({ default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column({ default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    @OneToMany(type => Institute, institute => institute.university)
    institutes: Institute[];
}
