// Utilise l'API Web Crypto (disponible en Edge Runtime et en Node.js)
// plutôt que le module `crypto` de Node, afin de fonctionner à la fois
// dans le middleware et dans les routes API.

const COOKIE_NAME = "rio_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 heures

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET n'est pas défini.");
  }
  return secret;
}

async function hmacKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(payload: string): Promise<string> {
  const key = await hmacKey(getSecret());
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return bufferToHex(signature);
}

function timingSafeEqualStrings(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function createSessionToken(): Promise<string> {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `admin.${expires}`;
  const signature = await sign(payload);
  return `${payload}.${signature}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [role, expiresRaw, signature] = parts;
  const payload = `${role}.${expiresRaw}`;

  let expected: string;
  try {
    expected = await sign(payload);
  } catch {
    return false;
  }

  if (!timingSafeEqualStrings(signature, expected)) return false;

  const expires = Number(expiresRaw);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;

  return role === "admin";
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return timingSafeEqualStrings(input, expected);
}

export { COOKIE_NAME };
