import { api } from "./api";

export async function lookupCep(cep: string) {
  const { data } = await api.get(`/integrations/cep/${cep}`);
  return data;
}