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

// aceita também previews da Vercel do mesmo projeto
const vercelPreviewRegex = /^https:\/\/smart-clinic-xi(-[a-z0-9-]+)?\.vercel\.app$/i;

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin) || vercelPreviewRegex.test(origin)) {
        return callback(null, true);
      }

      return callback(null, false); // melhor que lançar Error aqui
    },
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use(router);

connectDb().catch((err) => {
  console.error("[db] connection error:", err);
  process.exit(1);
});