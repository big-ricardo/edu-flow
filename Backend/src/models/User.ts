import mongoose, { Schema } from "mongoose";
import { IInstitute } from "./Institute";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  cpf: string;
  password: string;
  matriculation: string;
  role: "admin" | "student" | "teacher";
}

export interface IUserWithInstitute extends IUser {
  institute: IInstitute;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    cpf: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    matriculation: { type: String, required: true, unique: true },
    role: {
      type: String,
      required: true,
      enum: ["admin", "student", "teacher"],
    },
    institute: { type: Schema.Types.ObjectId, ref: "Institute", required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", UserSchema);
