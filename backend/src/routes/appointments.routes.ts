import { Router } from "express";
import {
  available,
  create,
  mine,
  cancelMine, // novo
} from "../controllers/appointments.controller";
import { requireAuth } from "../middlewares/requireAuth";
import { requireRole } from "../middlewares/requireRole"; // ✅ novo

export const appointmentsRoutes = Router();

appointmentsRoutes.get("/available", available);
appointmentsRoutes.post("/", requireAuth, create);
appointmentsRoutes.get("/me", requireAuth, mine);

// Patient-only cancel endpoint (segregado)
appointmentsRoutes.patch("/:id/cancel", requireAuth, requireRole("PATIENT"), cancelMine);
