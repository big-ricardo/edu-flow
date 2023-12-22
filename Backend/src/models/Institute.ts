import mongoose, { Connection, Schema } from "mongoose";
import { IUniversity } from "./University";

export interface IInstitute extends mongoose.Document {
  _id: string;
  name: string;
  acronym: string;
  active: boolean;
}

export interface IInstituteWithUniversity extends IInstitute {
  university: IUniversity;
}

export const schema: Schema = new Schema(
  {
    name: { type: String, required: true },
    acronym: { type: String, required: true, unique: true },
    active: { type: Boolean, default: true },
    university: {
      type: Schema.Types.ObjectId,
      ref: "University",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

class Institute {
  conn: Connection;

  constructor(conn: Connection) {
    this.conn = conn;
  }

  model() {
    return this.conn.model<IInstitute | IInstituteWithUniversity>(
      "Institute",
      schema
    );
  }
}

export default Institute;
