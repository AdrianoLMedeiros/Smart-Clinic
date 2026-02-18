import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms"; // <- IMPORTANTE (é daqui que vem StringValue)
import type { UserRole } from "../models/User";

export function signToken(userId: string, role: UserRole) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");

  // 👇 AQUI: tipagem correta do expiresIn
  const expiresIn: StringValue | number = (process.env.JWT_EXPIRES_IN ?? "1d") as StringValue;

  const jwtSecret: Secret = secret;

  // 👇 AQUI: options tipado como SignOptions
  const options: SignOptions = {
    subject: userId,
    expiresIn,
  };

  return jwt.sign({ role }, jwtSecret, options);
}

export function verifyToken(token: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");

  return jwt.verify(token, secret as Secret) as jwt.JwtPayload & { role: UserRole };
}
