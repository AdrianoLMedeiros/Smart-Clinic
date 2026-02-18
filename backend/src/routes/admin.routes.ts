import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { requireAdmin } from "../middlewares/requireAdmin";
import { listAll, changeStatus } from "../controllers/admin.controller";

export const adminRoutes = Router();

adminRoutes.use(requireAuth, requireAdmin);

adminRoutes.get("/appointments", listAll);
adminRoutes.patch("/appointments/:id/status", changeStatus);
