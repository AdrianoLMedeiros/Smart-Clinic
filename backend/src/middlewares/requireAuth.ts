import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export type AuthenticatedRequest = Request & {
auth?: { userId: string; role: "PATIENT" | "SECRETARY" | "ADMIN" };
};

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }

  const token = header.substring("Bearer ".length);

  try {
    const payload = verifyToken(token);
    req.auth = { userId: payload.sub as string, role: payload.role };
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
