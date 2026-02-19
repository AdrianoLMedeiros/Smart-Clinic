import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./requireAuth";

type Role = "PATIENT" | "SECRETARY" | "ADMIN";

export function requireRole(roles: Role | Role[]) {
  const allowed = Array.isArray(roles) ? roles : [roles];

  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.auth) return res.status(401).json({ message: "Unauthorized" });

    if (!allowed.includes(req.auth.role as Role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return next();
  };
}