import { api } from "./api";

export async function getAvailable(date: string) {
  const { data } = await api.get("/appointments/available", { params: { date } });
  return data; // esperado: string[] de horários
}

export async function createAppointment(payload: { date: string; time: string }) {
  const { data } = await api.post("/appointments", payload);
  return data;
}

export async function myAppointments() {
  const { data } = await api.get("/appointments/me");
  return data;
}