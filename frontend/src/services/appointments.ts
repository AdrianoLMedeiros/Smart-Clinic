import { api } from "./api";

type AvailabilityResponse = {
  date: string;
  slots: string[];
};

export async function getAvailable(date: string) {
  const { data } = await api.get<AvailabilityResponse>("/appointments/available", {
    params: { date },
  });
  return data.slots ?? [];
}

export async function createAppointment(payload: { date: string; time: string }) {
  const { data } = await api.post("/appointments", payload);
  return data;
}

export async function myAppointments() {
  const { data } = await api.get("/appointments/me");
  return data;
}