import { z } from "zod";

export const adminListSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELED"]).optional(),
});

export const adminUpdateStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELED"]),
});
