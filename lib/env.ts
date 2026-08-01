export function getEnvVar(name: string, required = true) {
  const value = process.env[name]?.trim();

  if (!value && required) {
    throw new Error(`Environment variable ${name} is required.`);
  }

  return value || "";
}

export const TELEGRAM_BOT_TOKEN = getEnvVar("TELEGRAM_BOT_TOKEN", false);
export const TELEGRAM_CHAT_ID = getEnvVar("TELEGRAM_CHAT_ID", false);
export const TELEGRAM_BOT_USERNAME = getEnvVar("TELEGRAM_BOT_USERNAME", false);
export const TELEGRAM_WEBHOOK_SECRET = getEnvVar("TELEGRAM_WEBHOOK_SECRET", false);
export const ADMIN_PASSWORD = getEnvVar("ADMIN_PASSWORD", false);
export const NEXT_PUBLIC_SUPABASE_URL = getEnvVar("NEXT_PUBLIC_SUPABASE_URL", false);
export const NEXT_PUBLIC_SUPABASE_ANON_KEY = getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY", false);
export const SUPABASE_SERVICE_ROLE_KEY = getEnvVar("SUPABASE_SERVICE_ROLE_KEY", false);
