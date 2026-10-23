import { z } from 'zod';

/**
 * Variables públicas previstas para fases posteriores.
 * En el MVP no hay ninguna obligatoria: la app funciona sin red.
 */
const envSchema = z.object({
  EXPO_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
});

export type Env = z.infer<typeof envSchema>;

export function readEnv(source: Record<string, string | undefined> = process.env): Env {
  const parsed = envSchema.safeParse(source);

  if (!parsed.success) {
    const fields = parsed.error.issues.map((issue) => issue.path.join('.')).join(', ');
    throw new Error('Configuración de entorno inválida: ' + fields);
  }

  return parsed.data;
}

export const env: Env = readEnv();
