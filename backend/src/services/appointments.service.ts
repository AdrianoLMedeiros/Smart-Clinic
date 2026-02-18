import { Appointment } from "../models/Appointment";
import { Types } from "mongoose";

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
  try {
    const appt = await Appointment.create({
      patientId: new Types.ObjectId(input.patientId),
      date: input.date,
      time: input.time,
      status: "PENDING",
      rainAlert: false,
    });

    return appt;
  } catch (e: any) {
    // 🔥 Conflito do índice único date+time
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
