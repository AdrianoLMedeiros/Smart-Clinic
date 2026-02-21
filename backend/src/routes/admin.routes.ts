import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
// import { requireAdmin } from "../middlewares/requireAdmin";
// DEPRECATED: requireAdmin is no longer used. Please use requireRole(["ADMIN"]) instead. 
import { listAll, changeStatus } from "../controllers/admin.controller";
import { requireRole } from "../middlewares/requireRole";

export const adminRoutes = Router();

adminRoutes.use(requireAuth, requireRole("SECRETARY", "ADMIN"));

adminRoutes.get("/appointments", listAll);
adminRoutes.patch("/appointments/:id/status", changeStatus);
