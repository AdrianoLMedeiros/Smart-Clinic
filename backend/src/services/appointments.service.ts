import { Appointment } from "../models/Appointment";
import { Types } from "mongoose";
import { User } from "../models/User";
import { getRainAlertForDate } from "./weather.service";


const DEFAULT_SLOTS = [
  "09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"
];

export async function getAvailableSlots(date: string) {
  const booked = await Appointment.find({ date, status: { $ne: "CANCELED" } })
    .select("time -_id");

  const bookedTimes = new Set(booked.map(b => b.time));
  return DEFAULT_SLOTS.filter(t => !bookedTimes.has(t));
}

export async function createAppointment(input: { patientId: string; date: string; time: string }) {
  // pega dados do usuário pra clima (se tiver address)
  const user = await User.findById(input.patientId).select("address");
  const city = user?.address?.city;
  const state = user?.address?.state;

  let rainAlert = false;
  let weatherSummary: string | undefined = undefined;

  // tenta clima, mas não trava o fluxo se falhar
  if (city) {
    try {
      const weather = await getRainAlertForDate({ city, state, date: input.date });
      rainAlert = weather.rainAlert;
      weatherSummary = weather.summary;
    } catch {
      // ignora falha da integração (MVP resiliente)
    }
  }

  try {
    const appt = await Appointment.create({
      patientId: new Types.ObjectId(input.patientId),
      date: input.date,
      time: input.time,
      status: "PENDING",
      rainAlert,
      weatherSummary,
    });

    return appt;
  } catch (e: any) {
    if (e?.code === 11000) {
      const err = new Error("Time slot already booked");
      (err as any).statusCode = 409;
      throw err;
    }
    throw e;
  }
}

export async function listMyAppointments(patientId: string) {
  return Appointment.find({ patientId })
    .sort({ date: 1, time: 1 });
}

export async function cancelAppointmentByPatient(
  appointmentId: string,
  patientId: string
) {
  // Buscar appointment
  const appt = await Appointment.findById(appointmentId);

  if (!appt) {
    throw { statusCode: 404, message: "Appointment not found" };
  }

  // Verificar se pertence ao paciente
  const ownerId = appt.patientId.toString();
  if (ownerId !== patientId) {
    throw { statusCode: 403, message: "Forbidden" };
  }

  // Idempotência (já cancelado)
  if (appt.status === "CANCELED") {
    return appt;
  }

  // (Opcional) impedir cancelamento no passado
  const appointmentDateTime = new Date(`${appt.date}T${appt.time}:00`);
  if (appointmentDateTime < new Date()) {
    throw {
      statusCode: 409,
      message: "Cannot cancel past appointments",
    };
  }

  //  Atualizar status
  appt.status = "CANCELED";
  await appt.save();

  return appt;
}