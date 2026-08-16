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
export const SITE_ORIGIN = getEnvVar("SITE_ORIGIN", false);

export function getTelegramBotToken() {
  return process.env.TELEGRAM_BOT_TOKEN?.trim() || "";
}

export function getTelegramChatId() {
  return process.env.TELEGRAM_CHAT_ID?.trim() || "";
}

export function getTelegramBotUsername() {
  return process.env.TELEGRAM_BOT_USERNAME?.trim() || "";
}
