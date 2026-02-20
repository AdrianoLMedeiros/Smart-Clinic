import { api } from "./api";

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELED";

export type AdminAppointment = {
  _id: string;
  patientId: {
    _id: string;
    name: string;
    email?: string;
    cep?: string;
    address?: any; // depois tipamos melhor.
  };
  date: string;
  time: string;
  status: AppointmentStatus;
  rainAlert: boolean;
  weatherSummary?: string;
  createdAt: string;
  updatedAt: string;
};

// Contrato do backend
const LIST_ALL_ENDPOINT = "/admin/appointments";
const UPDATE_STATUS_ENDPOINT = (id: string) => `/admin/appointments/${id}/status`;

export async function listAllAppointments(params?: {
  date?: string;
  status?: AppointmentStatus | "ALL";
}) {
  // Backend ainda não filtra por query, isso não atrapalha.
  const query: any = {};
  if (params?.date) query.date = params.date;
  if (params?.status && params.status !== "ALL") query.status = params.status;

  const { data } = await api.get(LIST_ALL_ENDPOINT, { params: query });

  // Normaliza formatos comuns
  if (Array.isArray(data)) return data as AdminAppointment[];
  if (Array.isArray(data?.appointments)) return data.appointments as AdminAppointment[];
  if (Array.isArray(data?.data)) return data.data as AdminAppointment[];

  return [] as AdminAppointment[];
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  const { data } = await api.patch(UPDATE_STATUS_ENDPOINT(id), { status });

  if (data?.appointment) return data.appointment as AdminAppointment;
  return data as AdminAppointment;
}