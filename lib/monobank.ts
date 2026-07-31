export type MonobankPubkeyImportRequest = {
  keyValue: string;
  keyName?: string;
  expiresAt?: string;
};

export function getMonobankApiToken() {
  return process.env.MONOBANK_API_TOKEN?.trim() || "";
}

export async function importMonopayPublicKey(
  token: string,
  payload: MonobankPubkeyImportRequest
) {
  const response = await fetch(
    "https://api.monobank.ua/api/merchant/monopay/pubkey-import",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Token": token,
      },
      body: JSON.stringify(payload),
    }
  );

  const responseText = await response.text();
  let responseBody: unknown;

  try {
    responseBody = responseText ? JSON.parse(responseText) : null;
  } catch {
    responseBody = responseText;
  }

  if (!response.ok) {
    throw new Error(
      `Monobank import failed: ${response.status} ${response.statusText} - ${
        typeof responseBody === "string" ? responseBody : JSON.stringify(responseBody)
      }`
    );
  }

  return responseBody;
}
