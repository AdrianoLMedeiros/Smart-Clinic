import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./config/db";
import { router } from "./routes/index";

dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use(router);

connectDb().catch((err) => {
  console.error("[db] connection error:", err);
  process.exit(1);
});