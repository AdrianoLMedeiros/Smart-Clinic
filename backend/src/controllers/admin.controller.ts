import { Request, Response } from "express";
import { adminListSchema, adminUpdateStatusSchema } from "../validators/admin.validators";
import { listAppointments, updateAppointmentStatus } from "../services/admin.service";

export async function listAll(req: Request, res: Response) {
  const parsed = adminListSchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ message: "Validation error", errors: parsed.error.flatten() });
  }

  const appointments = await listAppointments(parsed.data);
  return res.json({ appointments });
}

export async function changeStatus(req: Request, res: Response) {
  const parsed = adminUpdateStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Validation error", errors: parsed.error.flatten() });
  }

  try {
    const appointment = await updateAppointmentStatus({
      id: String(req.params.id),
      status: parsed.data.status,
    });
    return res.json({ appointment });
  } catch (e: any) {
    return res.status(e.statusCode || 500).json({ message: e.message || "Server error" });
  }
}
