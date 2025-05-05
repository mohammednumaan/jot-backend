import { z } from "zod";
import { zUserSchema } from "../user/user.z";

// AUTH SIGNUP REQUEST SCHEMA
const AuthSignupRequestSchema = z
  .object({
    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .email("Invalid email format"),
    password: z
      .string({ required_error: "Password is required" })
      .trim()
      .min(8, "Password must be at least 8 characters long"),

    username: z
      .string({ required_error: "Username is required" })
      .trim()
      .min(3, "Username must be at least 1 characters long")
      .max(20, "Usernames must be at most 20 characters long"),

    confirm_password: z
      .string({ required_error: "Conform Password is required" })
      .trim()
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine(
    (data) => {
      return data.password === data.confirm_password;
    },
    {
      message: "Passwords do not match",
      path: ["confirm_password"],
    },
  );

// AUTH SIGNUP RESPONSE SCHEMA
const AuthSignupResponseSchema = z.object({
  user: zUserSchema,
});

// AUTH REQUEST AND RESPONSE INFERRED TYPES
type AuthSignupRequest = z.infer<typeof AuthSignupRequestSchema>;
type AuthSignupResponse = z.infer<typeof AuthSignupResponseSchema>;

export {
  AuthSignupRequest,
  AuthSignupRequestSchema,
  AuthSignupResponse,
  AuthSignupResponseSchema,
};
