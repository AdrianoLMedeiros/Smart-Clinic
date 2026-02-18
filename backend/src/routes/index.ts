import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { appointmentsRoutes } from "./appointments.routes";
import { adminRoutes } from "./admin.routes";
import { integrationsRoutes } from "./integrations.routes";

export const router = Router();

router.use("/auth", authRoutes);
router.use("/appointments", appointmentsRoutes);
router.use("/admin", adminRoutes);
router.use("/integrations", integrationsRoutes);
