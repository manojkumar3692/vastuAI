import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const PRO_SESSION_COOKIE = "vastu_pro_session";
const SESSION_DAYS = 30;

export function normalizeIndianPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 10 && /^[6-9]/.test(digits)) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91") && /^[6-9]/.test(digits.slice(2))) {
    return `+${digits}`;
  }
  return null;
}

export function validatePin(pin: string): boolean {
  return /^\d{6}$/.test(pin);
}

export function hashPin(pin: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(pin, salt, 64);
  return `scrypt:${salt.toString("hex")}:${hash.toString("hex")}`;
}

export function verifyPin(pin: string, encoded: string): boolean {
  const [scheme, saltHex, hashHex] = encoded.split(":");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = crypto.scryptSync(pin, Buffer.from(saltHex, "hex"), expected.length);
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

function tokenHash(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createProSession(accountId: string): Promise<string> {
  const supabase = getSupabaseAdmin();
  const token = crypto.randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400000);
  const { error } = await supabase.from("vastu_sessions").insert({
    account_id: accountId,
    token_hash: tokenHash(token),
    expires_at: expiresAt.toISOString(),
  });
  if (error) throw new Error(`Could not create session: ${error.message}`);
  return token;
}

export async function setProSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(PRO_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
}

export async function clearProSession() {
  const jar = await cookies();
  const token = jar.get(PRO_SESSION_COOKIE)?.value;
  if (token) {
    await getSupabaseAdmin().from("vastu_sessions").delete().eq("token_hash", tokenHash(token));
  }
  jar.delete(PRO_SESSION_COOKIE);
}

export async function getProAccount() {
  const token = (await cookies()).get(PRO_SESSION_COOKIE)?.value;
  if (!token) return null;

  const supabase = getSupabaseAdmin();
  const { data: session } = await supabase
    .from("vastu_sessions")
    .select("account_id, expires_at")
    .eq("token_hash", tokenHash(token))
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  if (!session) return null;

  const { data: account } = await supabase
    .from("vastu_accounts")
    .select("id, name, email, phone, status, credits")
    .eq("id", session.account_id)
    .maybeSingle();
  return account || null;
}

