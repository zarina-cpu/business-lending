import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE = "camellia_admin";

function token() {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return null;
  return crypto.createHmac("sha256", secret).update("admin-session").digest("hex");
}

export async function isAdmin() {
  const expected = token();
  if (!expected) return false;
  const store = await cookies();
  return store.get(COOKIE)?.value === expected;
}

export async function setAdminCookie() {
  const expected = token();
  if (!expected) return false;
  const store = await cookies();
  store.set(COOKIE, expected, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return true;
}

export async function clearAdminCookie() {
  const store = await cookies();
  store.delete(COOKIE);
}

export function checkPassword(password) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !password) return false;
  const a = Buffer.from(String(password));
  const b = Buffer.from(String(expected));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
