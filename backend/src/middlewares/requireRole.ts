import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./requireAuth";

type Role = "PATIENT" | "SECRETARY" | "ADMIN";

export function requireRole(...allowed: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const role = req.auth?.role;
    if (!role) return res.status(401).json({ message: "Unauthorized" });

    if (!allowed.includes(role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return next();
  };
}