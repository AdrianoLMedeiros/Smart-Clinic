import { Router } from "express";
import { register, login, me } from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/requireAuth";

export const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/me", requireAuth, me);