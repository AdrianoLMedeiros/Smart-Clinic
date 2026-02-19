// DEPRECATED: This file is no longer used. Please use requireRole(["ADMIN"]) instead of requireAdmin.

// import { Response, NextFunction } from "express";
// import { AuthenticatedRequest } from "./requireAuth";

// export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
//   if (!req.auth) return res.status(401).json({ message: "Unauthorized" });

//   if (req.auth.role !== "ADMIN") {
//     return res.status(403).json({ message: "Forbidden: ADMIN only" });
//   }

//   return next();
// }
