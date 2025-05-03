import { z } from "zod";
import { zUserSchema } from "../user/user.z";

// AUTH LOGIN REQUEST SCHEMA
const AuthLoginRequestSchema = z.object({
  email: z.string().trim().email("Invalid email format"),
  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(8, "Password must be at least 8 characters long"),
});

// AUTH LOGIN RESPONSE SCHEMA
const AuthLoginResponseSchema = z.object({
  user: zUserSchema,
});

type AuthLoginRequest = z.infer<typeof AuthLoginRequestSchema>;
type AuthLoginResponse = z.infer<typeof AuthLoginResponseSchema>;

export {
  AuthLoginRequestSchema,
  AuthLoginResponseSchema,
  AuthLoginRequest,
  AuthLoginResponse,
};
