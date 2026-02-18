import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/requireAuth";
import { availableSchema, createAppointmentSchema } from "../validators/appointments.validators";
import { createAppointment, getAvailableSlots, listMyAppointments } from "../services/appointments.service";

export async function available(req: Request, res: Response) {
  const parsed = availableSchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ message: "Validation error", errors: parsed.error.flatten() });
  }

  const slots = await getAvailableSlots(parsed.data.date);
  return res.json({ date: parsed.data.date, slots });
}

export async function create(req: AuthenticatedRequest, res: Response) {
  const parsed = createAppointmentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Validation error", errors: parsed.error.flatten() });
  }

  const userId = req.auth?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const appt = await createAppointment({ patientId: userId, ...parsed.data });
    return res.status(201).json({ appointment: appt });
  } catch (e: any) {
    return res.status(e.statusCode || 500).json({ message: e.message || "Server error" });
  }
}

export async function mine(req: AuthenticatedRequest, res: Response) {
  const userId = req.auth?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const appointments = await listMyAppointments(userId);
  return res.json({ appointments });
}
