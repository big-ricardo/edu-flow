import mongoose, { ObjectId, Schema } from "mongoose";

export interface IAdminClient extends mongoose.Document {
  _id: ObjectId;
  name: string;
  acronym: string;
}

export const schema = new Schema<IAdminClient>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true },
    acronym: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default class AdminClient {
  conn: mongoose.Connection;

  constructor(conn: mongoose.Connection) {
    this.conn = conn;
  }

  model() {
    return this.conn.model<IAdminClient>("Client", schema);
  }
}
