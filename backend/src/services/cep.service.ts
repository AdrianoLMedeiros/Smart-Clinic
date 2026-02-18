import axios from "axios";

export type ViaCepResponse = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string; // cidade
  uf: string;
  erro?: boolean;
};

export async function lookupCep(rawCep: string) {
  // normaliza: remove tudo que não for número
  const cep = rawCep.replace(/\D/g, "");

  if (cep.length !== 8) {
    const err = new Error("CEP must have 8 digits");
    (err as any).statusCode = 400;
    throw err;
  }

  const url = `https://viacep.com.br/ws/${cep}/json/`;
  const { data } = await axios.get<ViaCepResponse>(url, { timeout: 8000 });

  if (data.erro) {
    const err = new Error("CEP not found");
    (err as any).statusCode = 404;
    throw err;
  }

  // Retorno “padronizado” (mais amigável pro frontend)
  return {
    cep: data.cep,
    street: data.logradouro,
    neighborhood: data.bairro,
    city: data.localidade,
    state: data.uf,
    complement: data.complemento,
  };
}
