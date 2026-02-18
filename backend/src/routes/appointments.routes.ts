import { Router } from "express";
import { available, create, mine } from "../controllers/appointments.controller";
import { requireAuth } from "../middlewares/requireAuth";

export const appointmentsRoutes = Router();

appointmentsRoutes.get("/available", available);
appointmentsRoutes.post("/", requireAuth, create);
appointmentsRoutes.get("/me", requireAuth, mine);
