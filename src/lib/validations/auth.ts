import { z } from "zod";

export const signupSchema = z.object({
  firstname: z.string().min(3, "Firstname must be at least 3 characters"),
  lastname: z.string().optional(),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignupInput = z.infer<typeof signupSchema>;
