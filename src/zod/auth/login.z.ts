import { z } from "zod";

// user schema
const UserSchema = z.object({
  username: z.string(),
  avatar: z.string(),
  joinedAt: z.date(),
});

// auth login request schema
const AuthLoginRequestSchema = z.object({
  username: z.string({ required_error: "Username is required" }).trim(),
  password: z.string({ required_error: "Password is required" }).trim(),
});

// auth login response schema
const AuthLoginResponseSchema = z.object({
  user: UserSchema,
});

// auth login request and response types
type AuthLoginRequestType = z.infer<typeof AuthLoginRequestSchema>;
type AuthLoginResponseType = z.infer<typeof AuthLoginResponseSchema>;

export {
  UserSchema,
  AuthLoginRequestSchema,
  AuthLoginRequestType,
  AuthLoginResponseSchema,
  AuthLoginResponseType,
};
