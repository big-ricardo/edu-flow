import mongoose, { Schema } from "mongoose";

export interface IInstitute {
  _id: string;
  name: string;
  acronym: string;
}

const schema: Schema = new Schema(
  {
    name: { type: String, required: true },
    acronym: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IInstitute>("Institute", schema);
