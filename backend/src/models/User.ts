import { Schema, model, Document } from "mongoose";

export type UserRole = "PATIENT" | "ADMIN";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  cep?: string;
  address?: {
    street?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema(
  {
    street: { type: String },
    neighborhood: { type: String },
    city: { type: String },
    state: { type: String },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["PATIENT", "ADMIN"], default: "PATIENT" },
    cep: { type: String },
    address: { type: AddressSchema },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", UserSchema);
