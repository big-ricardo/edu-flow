import "reflect-metadata";
import { DataSource } from "typeorm";
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

export async function connect(db: string) {
  const dataSource = new DataSource({
    type: "mongodb",
    host: MONGO_HOST,
    port: parseInt(MONGO_PORT, 10),
    username: MONGO_USER,
    password: MONGO_PASS,
    database: "typeorm",
    entities: Object.values(models),
    synchronize: true,
    logging: true,
  });

  return dataSource.initialize().catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    throw err;
  });
}

export async function disconnect(conn: DataSource): Promise<void> {
  if (!conn) {
    return;
  }

  await conn.destroy();
}

export default {
  connect,
  disconnect,
};
