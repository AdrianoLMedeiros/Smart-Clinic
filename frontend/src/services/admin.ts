import { api } from "./api";

export async function listAllAppointments(params?: { date?: string; status?: string }) {
  const { data } = await api.get("/admin/appointments", { params });
  return data;
}

export async function updateStatus(id: string, status: "CONFIRMED" | "CANCELED") {
  const { data } = await api.patch(`/admin/appointments/${id}/status`, { status });
  return data;
}