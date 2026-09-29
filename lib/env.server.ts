import "server-only";
import { z } from "zod";

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  FACE_SERVICE_URL: z.string().url(),
  FACE_SERVICE_TOKEN: z.string().min(1),
  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET: z.string().min(1),
});

const serverResult = serverSchema.safeParse({
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  FACE_SERVICE_URL: process.env.FACE_SERVICE_URL,
  FACE_SERVICE_TOKEN: process.env.FACE_SERVICE_TOKEN,
  R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
  R2_BUCKET: process.env.R2_BUCKET,
});

if (!serverResult.success) {
  throw new Error(
    `Variáveis de ambiente de servidor inválidas:\n${serverResult.error.message}`
  );
}

export const serverEnv = serverResult.data;
