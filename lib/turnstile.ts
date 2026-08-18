import "server-only";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type TurnstileVerification = {
  success?: boolean;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
};

type VerifyTurnstileOptions = {
  token: string;
  remoteIp?: string;
  expectedAction: "checkout" | "contact";
  idempotencyKey: string;
};

export async function verifyTurnstileToken({
  token,
  remoteIp,
  expectedAction,
  idempotencyKey,
}: VerifyTurnstileOptions) {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();

  if (!secret || !token || token.length > 2_048) {
    return { valid: false, errors: [!secret ? "missing-secret" : "invalid-token"] };
  }

  const body = new URLSearchParams({
    secret,
    response: token,
    idempotency_key: idempotencyKey,
  });

  if (remoteIp && remoteIp !== "unknown") body.set("remoteip", remoteIp);

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(6_000),
    });

    if (!response.ok) return { valid: false, errors: ["siteverify-unavailable"] };

    const result = (await response.json()) as TurnstileVerification;
    const valid = result.success === true && result.action === expectedAction;

    return {
      valid,
      errors: valid ? [] : result["error-codes"] ?? ["action-mismatch"],
      hostname: result.hostname,
    };
  } catch {
    return { valid: false, errors: ["siteverify-error"] };
  }
}
