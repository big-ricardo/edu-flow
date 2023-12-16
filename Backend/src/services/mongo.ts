import mongoose from "mongoose";
import models from "../models";

const {
  MONGO_HOST,
  MONGO_USER,
  MONGO_PASS,
  MONGO_PORT = "27017",
} = process.env;

if (!MONGO_HOST || !MONGO_USER || !MONGO_PASS) {
  throw new Error("Missing MONGO_* environment variables");
}

const conn_string = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}`;

export async function connect(db: string): Promise<typeof mongoose> {
  const uri = `${conn_string}/${db}?authSource=admin&readPreference=primary&ssl=false&directConnection=true`;
  const conn = await mongoose.connect(uri);

  Object.keys(models).forEach((key) => {
    conn.model(key, models[key]);
  });

  return conn;
}

export async function disconnect(conn: typeof mongoose) {
  if (!conn) {
    return;
  }

  await conn.disconnect();
}

export default {
  connect,
  disconnect,
};
