import mongoose, { ObjectId, Schema } from "mongoose";
import { IInstitute } from "./Institute";

export enum IUserRoles {
  admin = "admin",
  student = "student",
  teacher = "teacher",
}

type BaseUser = {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  matriculation?: string;
  activities: ObjectId[];
  roles: IUserRoles[];
  institute: IInstitute;
  active: boolean;
  isExternal: boolean;
  university_degree?: string;
  tutorials: string[];
} & mongoose.Document;

export type IUser = BaseUser;

export const schema: Schema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    active: { type: Boolean, default: true, index: true },
    isExternal: { type: Boolean, default: false, index: true },
    matriculation: {
      type: String,
    },
    activities: [{ type: Schema.Types.ObjectId, ref: "Activity" }],
    roles: [
      {
        type: String,
        required: true,
        enum: Object.values(IUserRoles),
        index: true,
      },
    ],
    institute: {
      type: Object,
      required: true,
    },
    university_degree: {
      type: String,
      required: () => (this as IUser).roles?.includes(IUserRoles.teacher),
      enum: ["mastermind", "doctor"],
    },
    tutorials: [{ type: String }],
  },
  {
    timestamps: true,
  }
).pre("save", function (next) {
  if (!this.roles.includes(IUserRoles.teacher)) {
    this.university_degree = null;
  }
  if (this.isExternal) {
    this.matriculation = null;
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
