import { configDotenv } from "dotenv";
import { z } from "zod";
configDotenv();

const EnvironmentSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  FRONTEND_URL: z.string().min(1, { message: "Frontend URL is required" }),
  DATABASE_URL: z.string().min(1, { message: "Database URL is required" }),
  PORT: z.coerce.number().int().positive().default(3000),
  ACCESS_TOKEN_SECRET: z
    .string()
    .min(1, { message: "Access token secret is required" }),
  SALT_ROUNDS: z.coerce.number().int().positive().default(10),
});

const parsedEnv = EnvironmentSchema.safeParse(process.env);
if (!parsedEnv.success) {
  console.error(
    "Invalid environment variables",
    JSON.stringify(parsedEnv.error.flatten()),
  );
  process.exit(1);
}

const envData = parsedEnv.data;
type EnvironmentType = z.infer<typeof EnvironmentSchema>;

export { envData, EnvironmentType };
