import { api } from "./api";

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELED";

export type Address = {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
};

export type AdminPatient = {
  _id: string;
  name: string;
  email?: string;
  cep?: string;
  address?: Address;
};

export type AdminAppointment = {
  _id: string;
  patientId?: AdminPatient | null; // refletindo a realidade (pode vir vazio se populate falhar)
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: AppointmentStatus;
  rainAlert: boolean;
  weatherSummary?: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

// Contrato do backend
const LIST_ALL_ENDPOINT = "/admin/appointments";
const UPDATE_STATUS_ENDPOINT = (id: string) => `/admin/appointments/${id}/status`;

type ListAllResponse =
  | AdminAppointment[]
  | { appointments: AdminAppointment[] }
  | { data: AdminAppointment[] };

export async function listAllAppointments(params?: {
  date?: string;
  status?: AppointmentStatus | "ALL";
}) {
  const query: Record<string, string> = {};

  if (params?.date) query.date = params.date;
  if (params?.status && params.status !== "ALL") query.status = params.status;

  const { data } = await api.get<ListAllResponse>(LIST_ALL_ENDPOINT, {
    params: query,
  });

  if (Array.isArray(data)) return data;
  if ("appointments" in data && Array.isArray(data.appointments)) return data.appointments;
  if ("data" in data && Array.isArray(data.data)) return data.data;

  return [] as AdminAppointment[];
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  const { data } = await api.patch<{ appointment?: AdminAppointment } | AdminAppointment>(
    UPDATE_STATUS_ENDPOINT(id),
    { status }
  );

  if (typeof data === "object" && data && "appointment" in data && data.appointment) {
    return data.appointment;
  }
  return data as AdminAppointment;
}