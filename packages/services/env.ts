import { z } from "zod";

const envSchema = z.object({
  JWT_SECRET: z.string().describe('Secret key for JWT Tokens'),
  GOOGLE_CLIENT_ID: z.string().describe('Google OAuth Client ID'),
});

function createEnv(env: NodeJS.ProcessEnv) {
  const safeParseResult = envSchema.safeParse(env);
  if (!safeParseResult.success) throw new Error(safeParseResult.error.message);
  return safeParseResult.data;
}

export const env = createEnv(process.env);
