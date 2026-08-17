import { createHmac, randomUUID, timingSafeEqual } from "crypto";

const MAX_AGE_MS = 24 * 60 * 60 * 1000;

function secret() {
  const value = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.ADMIN_PASSWORD;
  if (!value) throw new Error("Assembly signing secret is not configured");
  return value;
}

export function createAssemblyToken() {
  const payload = `${Date.now()}.${randomUUID()}`;
  const signature = createHmac("sha256", secret()).update(payload).digest("hex");
  return Buffer.from(`${payload}.${signature}`).toString("base64url");
}

export function verifyAssemblyToken(token: unknown) {
  if (typeof token !== "string" || token.length > 300) return false;
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [timestamp, nonce, signature] = decoded.split(".");
    if (!timestamp || !nonce || !signature) return false;
    const age = Date.now() - Number(timestamp);
    if (!Number.isFinite(age) || age < 0 || age > MAX_AGE_MS) return false;
    const expected = createHmac("sha256", secret())
      .update(`${timestamp}.${nonce}`)
      .digest("hex");
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
