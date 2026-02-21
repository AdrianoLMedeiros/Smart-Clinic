import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./config/db";
import { router } from "./routes/index";
import { createApp } from "./appFactory";

dotenv.config();

export const app = createApp();
 
const allowedOrigins = [
  "http://localhost:5173",
  "https://smart-clinic-xi.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use(router);

connectDb().catch((err) => {
  console.error("[db] connection error:", err);
  process.exit(1);
});