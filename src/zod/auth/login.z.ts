import { z } from "zod";

// user schema
const UserSchema = z.object({
  email: z.string().email("Invalid email format"),
  username: z.string(),
  avatar: z.string(),
  joinedAt: z.date(),
});

// auth login request schema
const AuthLoginRequestSchema = z.object({
  email: z.string().trim().email("Invalid email format"),
  password: z.string({ required_error: "Password is required" }).trim(),
});

// auth login response schema
const AuthLoginResponseSchema = z.object({
  user: UserSchema,
});

const AcessTokenPayloadSchema = z.object({
  id: z.string(),
});

// auth login request and response types
type AuthLoginRequestType = z.infer<typeof AuthLoginRequestSchema>;
type AuthLoginResponseType = z.infer<typeof AuthLoginResponseSchema>;
type AccessTokenPayloadType = z.infer<typeof AcessTokenPayloadSchema>;

export {
  UserSchema,
  AuthLoginRequestSchema,
  AuthLoginRequestType,
  AuthLoginResponseSchema,
  AuthLoginResponseType,
  AccessTokenPayloadType,
};
