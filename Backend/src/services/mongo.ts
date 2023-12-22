import mongoose, { Connection } from "mongoose";
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

export function connect(db: string): Connection {
  const uri = `${conn_string}/${db}?authSource=admin&readPreference=primary&ssl=false&directConnection=true`;
  const conn = mongoose.createConnection(uri);
  conn.useDb(db);

  Object.keys(models).forEach((key) => {
    conn.model(key, models[key]);
  });
  return conn;
}

export async function disconnect(conn: Connection): Promise<void> {
  if (!conn) {
    return;
  }

  await conn.close();
}

export default {
  connect,
  disconnect,
};
