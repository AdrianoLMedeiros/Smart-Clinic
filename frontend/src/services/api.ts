import axios from "axios";
import { useAuthStore } from "@/stores/auth";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
});

// Anexa token automaticamente
api.interceptors.request.use((config) => {
  const auth = useAuthStore();
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

// Normaliza erros (pra UX ficar limpa)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      "Erro inesperado ao comunicar com o servidor.";
    return Promise.reject({ ...err, message });
  }
);