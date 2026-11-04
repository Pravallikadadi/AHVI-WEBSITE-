import { cookies } from "next/headers";
import crypto from "crypto";
import { isAppwriteConfigured, createAdminClient, createSessionClient } from "@/lib/appwrite";

const COOKIE_NAME = "ahvi_admin_session";
const SECRET = process.env.ADMIN_SESSION_SECRET || "ahvi-dev-secret-change-me";

interface AdminSessionPayload {
  email: string;
  sessionSecret?: string;
  timestamp: number;
}

function sign(value: string) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

export function createSignedToken(payload: AdminSessionPayload): string {
  const json = JSON.stringify(payload);
  const base64 = Buffer.from(json).toString("base64url");
  const signature = sign(base64);
  return `${base64}.${signature}`;
}

export function parseSignedToken(token: string | undefined | null): AdminSessionPayload | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) {
    // Backward compatibility with simple tokens
    if (token === "admin." + sign("admin")) {
      return { email: process.env.ADMIN_EMAIL || "admin@ahvi.com", timestamp: Date.now() };
    }
    return null;
  }
  const [base64, signature] = parts;
  const expectedSig = sign(base64);
  if (signature !== expectedSig) return null;

  try {
    const raw = Buffer.from(base64, "base64url").toString("utf8");
    return JSON.parse(raw) as AdminSessionPayload;
  } catch {
    return null;
  }
}

/**
 * Authenticate admin with Appwrite or fallback password
 */
export async function authenticateAdmin(credentials: { email?: string; password: string }): Promise<{
  success: boolean;
  error?: string;
  token?: string;
}> {
  const email = (credentials.email || process.env.ADMIN_EMAIL || "admin@ahvi.com").trim().toLowerCase();
  const password = credentials.password;

  if (isAppwriteConfigured()) {
    try {
      // 1. Authenticate with Appwrite Account service
      const { client } = createAdminClient();
      const { Account } = await import("node-appwrite");
      const account = new Account(client);

      const session = await account.createEmailPasswordSession(email, password);
      const token = createSignedToken({
        email,
        sessionSecret: session.secret,
        timestamp: Date.now(),
      });
      return { success: true, token };
    } catch (err: any) {
      // If user doesn't exist yet or invalid credentials, check if it matches local admin fallback
      const expectedPassword = process.env.ADMIN_PASSWORD || "ahvi-admin";
      if (password === expectedPassword) {
        const token = createSignedToken({ email, timestamp: Date.now() });
        return { success: true, token };
      }
      return { success: false, error: err?.message || "Invalid email or password" };
    }
  }

  // Local fallback when Appwrite is not yet configured
  const expectedPassword = process.env.ADMIN_PASSWORD || "ahvi-admin";
  if (password === expectedPassword) {
    const token = createSignedToken({ email, timestamp: Date.now() });
    return { success: true, token };
  }

  return { success: false, error: "Invalid password" };
}

export async function setAdminSession(token: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  const payload = parseSignedToken(token);

  if (payload?.sessionSecret && isAppwriteConfigured()) {
    try {
      const { account } = createSessionClient(payload.sessionSecret);
      await account.deleteSession("current");
    } catch {
      // Ignore cleanup error if session already expired
    }
  }

  store.delete(COOKIE_NAME);
}

export async function isAdminAuthed(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return isValidSessionToken(token);
}

export function isValidSessionToken(token: string | undefined | null): boolean {
  const payload = parseSignedToken(token);
  if (!payload) return false;
  // Expire after 7 days
  const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
  if (Date.now() - payload.timestamp > maxAgeMs) return false;
  return true;
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
