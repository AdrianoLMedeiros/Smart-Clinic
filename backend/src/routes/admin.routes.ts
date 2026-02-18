import { Router } from "express";
export const adminRoutes = Router();

// TODO Sprint 4
adminRoutes.get("/appointments", (_req, res) => res.status(501).json({ message: "Not implemented" }));
adminRoutes.patch("/appointments/:id/status", (_req, res) => res.status(501).json({ message: "Not implemented" }));
