import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

import mongoose from "mongoose";
import { connectDb, disconnectDb } from "../config/db";

export async function connectTestDb() {
  const uri = process.env.MONGODB_URI_TEST;
  if (!uri) throw new Error("MONGODB_URI_TEST is not set in .env.test");

  await connectDb(uri);
}

export async function clearTestDb() {
  if (!mongoose.connection.db) {
    throw new Error("Database not connected");
  }

  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
}

export async function disconnectTestDb() {
  await disconnectDb();
}
