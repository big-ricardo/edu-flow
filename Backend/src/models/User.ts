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
  matriculation: string;
  activities: ObjectId[];
  roles: IUserRoles[];
  institute: IInstitute;
  active: boolean;
  university_degree?: string;
  isExternal: boolean;
  activity_pending: {
    _id: ObjectId;
    activity: ObjectId;
    form: ObjectId;
  }[];
};

type AdminOrStudent = BaseUser & { role: "admin" | "student" };
type Teacher = BaseUser & { role: "teacher"; university_degree: string };

export type IUser = AdminOrStudent | Teacher;

export const schema: Schema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    active: { type: Boolean, default: true },
    matriculation: { type: String, required: true, unique: true, index: true },
    activities: [{ type: Schema.Types.ObjectId, ref: "Activity" }],
    isExternal: { type: Boolean, default: false, index: true },
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
    activity_pending: [
      {
        _id: { type: Schema.Types.ObjectId, auto: true },
        activity: { type: Schema.Types.ObjectId, ref: "Activity" },
        form: { type: Schema.Types.ObjectId, ref: "Form" },
      },
    ],
  },
  {
    timestamps: true,
  }
).pre("save", function (next) {
  if (!this.roles.includes(IUserRoles.teacher)) {
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
