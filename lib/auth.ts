import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "ahvi_admin_session";
const SECRET = process.env.ADMIN_SESSION_SECRET || "ahvi-dev-secret-change-me";

function sign(value: string) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

export function checkPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD || "ahvi-admin";
  return password === expected;
}

export function sessionToken() {
  const value = "admin";
  return value + "." + sign(value);
}

export async function setAdminSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAdminAuthed() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return !!token && token === sessionToken();
}

export function isValidSessionToken(token: string | undefined | null) {
  return !!token && token === sessionToken();
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
