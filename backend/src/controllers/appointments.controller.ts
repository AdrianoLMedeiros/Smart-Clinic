import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/requireAuth";
import {
  availableSchema,
  createAppointmentSchema,
} from "../validators/appointments.validators";
import {
  createAppointment,
  getAvailableSlots,
  listMyAppointments,
  cancelAppointmentByPatient, // novo
} from "../services/appointments.service";
import { isWeekendISO } from "../utils/dateRules";

export async function available(req: Request, res: Response) {
  const parsed = availableSchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Validation error",
      errors: parsed.error.flatten(),
    });
  }

  const { date } = parsed.data;
  if (isWeekendISO(date)) {
    return res
      .status(400)
      .json({ message: "Appointments are not available on weekends." });
  }

  const slots = await getAvailableSlots(date);
  return res.json({ date, slots });
}

export async function create(req: AuthenticatedRequest, res: Response) {
  const parsed = createAppointmentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: "Validation error", errors: parsed.error.flatten() });
  }

  if (isWeekendISO(parsed.data.date)) {
    return res
      .status(400)
      .json({ message: "Appointments cannot be scheduled on weekends." });
  }

  const userId = req.auth?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const appt = await createAppointment({ patientId: userId, ...parsed.data });
    return res.status(201).json({ appointment: appt });
  } catch (e: any) {
    return res
      .status(e.statusCode || 500)
      .json({ message: e.message || "Server error" });
  }
}

export async function mine(req: AuthenticatedRequest, res: Response) {
  const userId = req.auth?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const appointments = await listMyAppointments(userId);
  return res.json({ appointments });
}

// NOVO: PATIENT cancela o próprio appointment (rota segregada)
export async function cancelMine(
  req: AuthenticatedRequest & { params: { id: string } },
  res: Response
) {
  const userId = req.auth?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const appointmentId = req.params.id;

  try {
    const updated = await cancelAppointmentByPatient(appointmentId, userId);
    return res.json({ appointment: updated });
  } catch (e: any) {
    return res
      .status(e.statusCode || 500)
      .json({ message: e.message || "Server error" });
  }
}