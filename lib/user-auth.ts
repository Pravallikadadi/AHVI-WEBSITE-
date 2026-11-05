import { cookies } from "next/headers";
import { Account, AppwriteException, Client } from "node-appwrite";
import {
  APPWRITE_CONFIG,
  ID,
  createAdminClient,
  createSessionClient,
  isAppwriteConfigured,
} from "@/lib/appwrite";

/**
 * End-user authentication for the public AHVI website.
 *
 * Runs on the same Appwrite project (users + sessions) that the admin area already uses, but it is a
 * completely separate session from the admin one:
 *  - its own cookie, and
 *  - the cookie holds ONLY the raw Appwrite session secret. It is deliberately NOT a token signed with
 *    ADMIN_SESSION_SECRET — that scheme is what grants /admin access, so reusing it would let a user
 *    present their own cookie as an admin one. Here validity is decided by Appwrite on every check.
 */

export const USER_COOKIE_NAME = "ahvi_user_session";
const USER_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days, rolling only on new login

export interface PublicUser {
  name: string;
  email: string;
}

export class UserAuthError extends Error {
  status: number;
  code: string;
  constructor(message: string, status = 400, code = "auth_error") {
    super(message);
    this.name = "UserAuthError";
    this.status = status;
    this.code = code;
  }
}

const UNAVAILABLE = () =>
  new UserAuthError("Accounts are temporarily unavailable. Please try again shortly.", 503, "unavailable");

function toPublicUser(user: { name?: string; email?: string }): PublicUser {
  return { name: user.name || "", email: user.email || "" };
}

function appwriteCode(err: unknown): number | null {
  return err instanceof AppwriteException ? err.code : null;
}

function upstreamError(err: unknown): UserAuthError {
  const code = appwriteCode(err);
  if (code === 429) {
    return new UserAuthError("Too many attempts. Please wait a moment and try again.", 429, "rate_limited");
  }
  console.error("[user-auth] Appwrite error:", err instanceof Error ? err.message : err);
  return new UserAuthError("We couldn't reach AHVI accounts right now. Please try again shortly.", 502, "upstream");
}

/** Plain project client — no API key. Used for the guest-scoped recovery endpoints. */
function createPublicAccount() {
  const client = new Client().setEndpoint(APPWRITE_CONFIG.endpoint).setProject(APPWRITE_CONFIG.projectId);
  return new Account(client);
}

export function isUserAuthAvailable(): boolean {
  return isAppwriteConfigured();
}

export async function signUpUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<{ user: PublicUser; secret: string }> {
  if (!isAppwriteConfigured()) throw UNAVAILABLE();

  const email = input.email.trim().toLowerCase();
  const exists = () =>
    new UserAuthError("An account with this email already exists. Try logging in instead.", 409, "email_exists");

  // The admin email is reserved for the admin area.
  if (email === APPWRITE_CONFIG.adminEmail.toLowerCase()) throw exists();

  const { users, account } = createAdminClient();

  try {
    await users.create({ userId: ID.unique(), email, password: input.password, name: input.name.trim() });
  } catch (err) {
    const code = appwriteCode(err);
    if (code === 409) throw exists();
    if (code === 400) {
      throw new UserAuthError("Please check your details and try again.", 400, "invalid");
    }
    throw upstreamError(err);
  }

  try {
    const session = await account.createEmailPasswordSession({ email, password: input.password });
    return { user: { name: input.name.trim(), email }, secret: session.secret };
  } catch (err) {
    console.error("[user-auth] Session creation after signup failed:", err instanceof Error ? err.message : err);
    throw new UserAuthError(
      "Your account was created, but we couldn't sign you in automatically. Please log in.",
      502,
      "signup_session_failed"
    );
  }
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<{ user: PublicUser; secret: string }> {
  if (!isAppwriteConfigured()) throw UNAVAILABLE();

  const email = input.email.trim().toLowerCase();
  const { account } = createAdminClient();

  let secret: string;
  try {
    const session = await account.createEmailPasswordSession({ email, password: input.password });
    secret = session.secret;
  } catch (err) {
    const code = appwriteCode(err);
    // Same message for unknown email, wrong password or blocked account — never reveal which.
    if (code === 401 || code === 400 || code === 404) {
      throw new UserAuthError("Incorrect email or password.", 401, "invalid_credentials");
    }
    throw upstreamError(err);
  }

  try {
    const me = await createSessionClient(secret).account.get();
    return { user: toPublicUser(me), secret };
  } catch {
    return { user: { name: "", email }, secret };
  }
}

export type SessionLookup =
  | { state: "authenticated"; user: PublicUser }
  | { state: "anonymous" }
  | { state: "error" };

/** Resolve a session secret to a user by asking Appwrite. "error" means "could not verify" — not "logged out". */
export async function lookupSession(secret: string | null | undefined): Promise<SessionLookup> {
  if (!secret) return { state: "anonymous" };
  try {
    const me = await createSessionClient(secret).account.get();
    return { state: "authenticated", user: toPublicUser(me) };
  } catch (err) {
    const code = appwriteCode(err);
    if (code === 401 || code === 403) return { state: "anonymous" };
    console.error("[user-auth] Session lookup failed:", err instanceof Error ? err.message : err);
    return { state: "error" };
  }
}

export async function logoutUser(secret: string | null | undefined): Promise<void> {
  if (!secret) return;
  try {
    await createSessionClient(secret).account.deleteSession({ sessionId: "current" });
  } catch {
    // Session already expired or Appwrite unreachable — the cookie is cleared either way.
  }
}

/**
 * Send a password-recovery email. Resolves quietly for unknown emails so the response never reveals
 * whether an account exists; real delivery/config failures still throw.
 */
export async function requestPasswordRecovery(email: string, redirectUrl: string): Promise<void> {
  if (!isAppwriteConfigured()) throw UNAVAILABLE();
  try {
    await createPublicAccount().createRecovery({ email: email.trim().toLowerCase(), url: redirectUrl });
  } catch (err) {
    const code = appwriteCode(err);
    if (code === 404) return; // no such user
    throw upstreamError(err);
  }
}

export async function completePasswordRecovery(input: {
  userId: string;
  secret: string;
  password: string;
}): Promise<void> {
  if (!isAppwriteConfigured()) throw UNAVAILABLE();
  try {
    await createPublicAccount().updateRecovery({
      userId: input.userId,
      secret: input.secret,
      password: input.password,
    });
  } catch (err) {
    const code = appwriteCode(err);
    if (code === 401 || code === 404) {
      throw new UserAuthError(
        "This reset link is invalid or has expired. Please request a new one.",
        400,
        "invalid_reset_link"
      );
    }
    if (code === 400) {
      throw new UserAuthError("Please choose a different password and try again.", 400, "invalid");
    }
    throw upstreamError(err);
  }
}

export async function setUserSessionCookie(secret: string) {
  const store = await cookies();
  store.set(USER_COOKIE_NAME, secret, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: USER_COOKIE_MAX_AGE,
  });
}

export async function clearUserSessionCookie() {
  const store = await cookies();
  store.delete(USER_COOKIE_NAME);
}

export async function getUserSessionSecret(): Promise<string | null> {
  const store = await cookies();
  return store.get(USER_COOKIE_NAME)?.value || null;
}

/** Origin used inside recovery emails. Prefer the configured public URL over the request's Host header. */
export function siteOrigin(requestOrigin: string): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  return (configured || requestOrigin).replace(/\/+$/, "");
}
