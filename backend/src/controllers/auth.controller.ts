import { Request, Response } from "express";
import { registerSchema, loginSchema } from "../validators/auth.validators";
import { registerUser, loginUser } from "../services/auth.service";
import { User } from "../models/User";
import { AuthenticatedRequest } from "../middlewares/requireAuth";

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Validation error", errors: parsed.error.flatten() });
  }

  try {
    const result = await registerUser(parsed.data);
    return res.status(201).json(result);
  } catch (e: any) {
    return res.status(e.statusCode || 500).json({ message: e.message || "Server error" });
  }
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Validation error", errors: parsed.error.flatten() });
  }

  try {
    const result = await loginUser(parsed.data);
    return res.status(200).json(result);
  } catch (e: any) {
    return res.status(e.statusCode || 500).json({ message: e.message || "Server error" });
  }
}

export async function me(req: AuthenticatedRequest, res: Response) {
  const userId = req.auth?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const user = await User.findById(userId).select("name email role cep address createdAt updatedAt");
  if (!user) return res.status(404).json({ message: "User not found" });

  return res.json({ user });
}
