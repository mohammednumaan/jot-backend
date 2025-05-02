import { z } from "zod";

export const zUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  username: z.string(),
  avatar: z.string(),
  joinedAt: z.date(),
});
