import mongoose, { Connection } from "mongoose";
import clientModels from "../models/client";
import adminModels from "../models/admin";

const {
  MONGO_HOST,
  MONGO_USER,
  MONGO_PASS,
  MONGO_PORT = "27017",
  MONGO_ADMIN_DB = "global",
} = process.env;

if (!MONGO_HOST || !MONGO_USER || !MONGO_PASS) {
  throw new Error("Missing MONGO_* environment variables");
}

const CON_STRING = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}`;
const PARAMS =
  "authSource=admin&readPreference=primary&ssl=false&directConnection=true";

export function connect(db: string): Connection {
  const uri = `${CON_STRING}/${db}?${PARAMS}`;
  const conn = mongoose.createConnection(uri);
  conn.useDb(db);
  conn.once("open", () => {
    console.log(`Connected to ${db} database`);
  });

  Object.keys(clientModels).forEach((key) => {
    conn.model(key, clientModels[key]);
  });
  return conn;
}

export async function disconnect(conn: Connection): Promise<void> {
  if (!conn) {
    return;
  }

  await conn.close();
}

export async function connectAdmin(): Promise<Connection> {
  const uri = `${CON_STRING}/${MONGO_ADMIN_DB}?${PARAMS}`;
  const conn = mongoose.createConnection(uri);
  conn.useDb(MONGO_ADMIN_DB);
  conn.once("open", () => {
    console.log(`Connected to ${MONGO_ADMIN_DB} database`);
  });

  Object.keys(adminModels).forEach((key) => {
    conn.model(key, adminModels[key]);
  });

  return conn;
}

export async function disconnectAdmin(conn: Connection): Promise<void> {
  if (!conn) {
    return;
  }

  await conn.close();
}

export default {
  connect,
  disconnect,
  connectAdmin,
  disconnectAdmin,
};
