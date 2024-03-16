import { Entity, Column, ObjectIdColumn, ObjectId } from "typeorm";

@Entity()
export class Email {
    @ObjectIdColumn()
    id: ObjectId;

    @Column({ unique: true })
    slug: string;

    @Column()
    subject: string;

    @Column()
    htmlTemplate: string;

    @Column({ type: "json", nullable: true })
    jsonTemplate: object | null;

    @Column({ default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column({ default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    // You may add other methods or hooks here as needed
}
