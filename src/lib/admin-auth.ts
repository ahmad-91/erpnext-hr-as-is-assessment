import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE = "as_is_admin";

function secret() {
  return process.env.ADMIN_PASSWORD || "erpnext-admin";
}

export function signAdminToken(): string {
  const day = new Date().toISOString().slice(0, 10);
  return createHmac("sha256", secret()).update(`admin:${day}`).digest("hex");
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  const expected = signAdminToken();
  try {
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  return verifyAdminToken(jar.get(COOKIE)?.value);
}

export function adminCookieName() {
  return COOKIE;
}

export function checkPassword(password: string): boolean {
  const expected = secret();
  try {
    const a = Buffer.from(password);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
