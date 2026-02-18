import bcrypt from "bcrypt";
import { User } from "../models/User";
import { signToken } from "../utils/jwt";
import { lookupCep } from "./cep.service";


export async function registerUser(input: { name: string; email: string; password: string; cep?: string }) {
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    const err = new Error("Email already in use");
    (err as any).statusCode = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  // se vier CEP, busca no ViaCEP e monta address
  let address: any = undefined;
  let cep: string | undefined = undefined;

  if (input.cep && input.cep.trim() !== "") {
    const cepResult = await lookupCep(input.cep);

    cep = cepResult.cep;
    address = {
      street: cepResult.street,
      neighborhood: cepResult.neighborhood,
      city: cepResult.city,
      state: cepResult.state,
    };
  }

  const user = await User.create({
    name: input.name,
    email: input.email,
    passwordHash,
    role: "PATIENT",
    cep,
    address,
  });

  const token = signToken(user.id, user.role);

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role, cep: user.cep, address: user.address },
    token,
  };
}

export async function loginUser(input: { email: string; password: string }) {
  const user = await User.findOne({ email: input.email });
  if (!user) {
    const err = new Error("Invalid credentials");
    (err as any).statusCode = 401;
    throw err;
  }

  const ok = await bcrypt.compare(input.password, user.passwordHash);
  if (!ok) {
    const err = new Error("Invalid credentials");
    (err as any).statusCode = 401;
    throw err;
  }

  const token = signToken(user.id, user.role);

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token,
  };
}
