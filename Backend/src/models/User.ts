import mongoose, { Schema } from "mongoose";

type BaseUser = {
  _id: string;
  name: string;
  email: string;
  cpf: string;
  password: string;
  matriculation: string;
  institute: string;
  active: boolean;
  university_degree?: string;
};

type AdminOrStudent = BaseUser & { role: "admin" | "student" };
type Teacher = BaseUser & { role: "teacher"; university_degree: string };

export type IUser = AdminOrStudent | Teacher;

export const schema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    cpf: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    active: { type: Boolean, default: true },
    matriculation: { type: String, required: true, unique: true },
    role: {
      type: String,
      required: true,
      enum: ["admin", "student", "teacher"],
    },
    institute: {
      type: Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },
    university_degree: {
      type: String,
      required: () => (this as IUser).role === "teacher",
      enum: ["mastermind", "doctor"],
    },
  },
  {
    timestamps: true,
  },
)
  .index({ cpf: 1 })
  .pre("save", function (next) {
    if (this.role !== "teacher") {
      this.university_degree = null;
    }
    next();
  });

export default class User {
  conn: mongoose.Connection;

  constructor(conn: mongoose.Connection) {
    this.conn = conn;
  }

  model() {
    return this.conn.model<IUser>("User", schema);
  }
}
