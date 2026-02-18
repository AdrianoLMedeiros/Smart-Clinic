import { Appointment, type AppointmentStatus } from "../models/Appointment";

export async function listAppointments(filters: { date?: string; status?: AppointmentStatus }) {
  const query: any = {};

  if (filters.date) query.date = filters.date;
  if (filters.status) query.status = filters.status;

  return Appointment.find(query)
    .populate("patientId", "name email cep address")
    .sort({ date: 1, time: 1 });
}

export async function updateAppointmentStatus(input: { id: string; status: AppointmentStatus }) {
  const appt = await Appointment.findByIdAndUpdate(
    input.id,
    { status: input.status },
    { new: true }
  ).populate("patientId", "name email");

  if (!appt) {
    const err = new Error("Appointment not found");
    (err as any).statusCode = 404;
    throw err;
  }

  return appt;
}
