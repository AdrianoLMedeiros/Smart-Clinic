import { api } from "./api";

export async function login(payload: { email: string; password: string }) {
  const { data } = await api.post("/auth/login", payload);
  return data; // esperado: { token, user }
}

export async function register(payload: {
  name: string;
  email: string;
  password: string;
  cep?: string;
  role?: "PATIENT" | "SECRETARY";
}) {
  const { data } = await api.post("/auth/register", payload);
  return data;
}

export async function me() {
  const { data } = await api.get("/auth/me");
  return data;
}