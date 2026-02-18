import { Router } from "express";
import { getCep } from "../controllers/integrations.controller";

export const integrationsRoutes = Router();

integrationsRoutes.get("/cep/:cep", getCep);
