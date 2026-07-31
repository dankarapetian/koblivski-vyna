export function getEnvVar(name: string, required = true) {
  const value = process.env[name]?.trim();

  if (!value && required) {
    throw new Error(`Environment variable ${name} is required.`);
  }

  return value || "";
}

export const MONOBANK_API_TOKEN = getEnvVar("MONOBANK_API_TOKEN", false);
export const MONOBANK_PUBKEY_BASE64 = getEnvVar("MONOBANK_PUBKEY_BASE64", false);
export const MONOBANK_PUBKEY_NAME = getEnvVar("MONOBANK_PUBKEY_NAME", false);
export const MONOBANK_PUBKEY_EXPIRES_AT = getEnvVar("MONOBANK_PUBKEY_EXPIRES_AT", false);
export const TELEGRAM_BOT_TOKEN = getEnvVar("TELEGRAM_BOT_TOKEN", false);
export const TELEGRAM_CHAT_ID = getEnvVar("TELEGRAM_CHAT_ID", false);
export const TELEGRAM_BOT_USERNAME = getEnvVar("TELEGRAM_BOT_USERNAME", false);
