import { Request, Response } from "express";
import { lookupCep } from "../services/cep.service";

export async function getCep(req: Request, res: Response) {
  try {
    const cepParam = req.params.cep;

    // garante string (se vier array por alguma tipagem/rota, pega o primeiro)
    const cep = Array.isArray(cepParam) ? cepParam[0] : cepParam;

    const result = await lookupCep(cep);
    return res.json(result);
  } catch (e: any) {
    return res.status(e.statusCode || 500).json({ message: e.message || "Server error" });
  }
}
