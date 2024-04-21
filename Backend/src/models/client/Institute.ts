import mongoose, { Connection, Schema } from "mongoose";
import { IUniversity, schema as universitySchema } from "./University";

export interface IInstitute extends mongoose.Document {
  _id: string;
  name: string;
  acronym: string;
  active: boolean;
  university: IUniversity;
}

export const schema: Schema = new Schema(
  {
    name: { type: String, required: true },
    acronym: { type: String, required: true, unique: true },
    active: { type: Boolean, default: true },
    university: { type: Object, required: true },
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
    return this.conn.model<IInstitute>("Institute", schema);
  }
}

export default Institute;
