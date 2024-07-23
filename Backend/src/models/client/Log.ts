import mongoose, { Connection, Schema } from "mongoose";

export interface ILog extends mongoose.Document {
  _id: string | mongoose.Types.ObjectId;
  user?: {
    _id: string;
    name: string;
  };
  route: string;
  data: any;
  level: string;
  timestamp: Date;
  response_at?: Date;
}

export const schema: Schema = new Schema(
  {
    user: {
      _id: { type: String },
      name: { type: String },
    },
    route: { type: String, required: true },
    data: { type: Object, required: true },
    level: { type: String, required: true },
    timestamp: { type: Date, required: true },
    response_at: { type: Date, required: false, default: null },
  },
  {
    timestamps: true,
  }
).index({ route: 1, level: 1, timestamp: 1, "user._id": 1 });

export default class Log {
  conn: Connection;

  constructor(conn: Connection) {
    this.conn = conn;
  }

  model() {
    return this.conn.model<ILog>("Log", schema);
  }
}
