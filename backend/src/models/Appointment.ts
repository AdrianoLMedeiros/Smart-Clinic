import { Schema, model, Document, Types } from "mongoose";

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELED";

export interface IAppointment extends Document {
  patientId: Types.ObjectId;
  date: string;   // YYYY-MM-DD
  time: string;   // HH:mm
  status: AppointmentStatus;
  rainAlert: boolean;
  weatherSummary?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true }, // guardamos como string pra simplificar
    time: { type: String, required: true },
    status: { type: String, enum: ["PENDING", "CONFIRMED", "CANCELED"], default: "PENDING" },
    rainAlert: { type: Boolean, default: false },
    weatherSummary: { type: String },
  },
  { timestamps: true }
);

// 🔥 Regra de conflito do MVP: não pode repetir date+time
AppointmentSchema.index({ date: 1, time: 1 }, { unique: true });

export const Appointment = model<IAppointment>("Appointment", AppointmentSchema);
