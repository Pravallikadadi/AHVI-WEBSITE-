"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Client-side auth state + the rules for when the signup/login popup appears.
 *
 * Popup rules (see the effect below):
 *  - Scheduled once per page load, AUTO_OPEN_DELAY_MS after mount.
 *  - Only opens if the server has just confirmed the visitor is NOT authenticated. If the check fails or
 *    can't be verified, the popup stays closed (never nag a possibly-logged-in user).
 *  - Closing it persists nothing — no cookie, localStorage or sessionStorage flag — so the next visit
 *    (next page load) shows it again. Client-side navigation within a visit does not re-trigger it.
 *  - Once authenticated it never auto-opens again.
 */

/** 1–2 seconds after a new visit. */
export const AUTO_OPEN_DELAY_MS = 1500;
const SESSION_CHECK_TIMEOUT_MS = 8000;
const CHANNEL_NAME = "ahvi-auth";

/** Routes where the auto popup must not appear (admin has its own login; reset page is itself an auth flow). */
const AUTO_POPUP_EXCLUDED_PREFIXES = ["/admin", "/reset-password"];
export function isAutoPopupExcluded(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return AUTO_POPUP_EXCLUDED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "unavailable" | "unknown";
export type AuthUser = { name: string; email: string };
export type AuthView = "signup" | "login";

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  popupOpen: boolean;
  popupView: AuthView;
  openAuth: (view?: AuthView) => void;
  closeAuth: () => void;
  /** Call after a successful signup/login response. */
  setSignedIn: (user: AuthUser) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchSession(): Promise<{ status: AuthStatus; user: AuthUser | null }> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), SESSION_CHECK_TIMEOUT_MS);
  try {
    const res = await fetch("/api/user/session", {
      cache: "no-store",
      credentials: "same-origin",
      signal: controller.signal,
    });
    if (!res.ok) return { status: "unknown", user: null };
    const data = await res.json();
    if (data?.authenticated === true && data.user) {
      return { status: "authenticated", user: { name: data.user.name || "", email: data.user.email || "" } };
    }
    if (data?.authenticated === false) {
      return { status: data.available === false ? "unavailable" : "unauthenticated", user: null };
    }
    return { status: "unknown", user: null };
  } catch {
    return { status: "unknown", user: null };
  } finally {
    window.clearTimeout(timer);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupView, setPopupView] = useState<AuthView>("signup");

  // Refs so timers/async callbacks always see the latest values.
  const statusRef = useRef<AuthStatus>("loading");
  const pathnameRef = useRef(pathname);
  const channelRef = useRef<BroadcastChannel | null>(null);
  pathnameRef.current = pathname;

  const applyStatus = useCallback((next: AuthStatus, nextUser: AuthUser | null) => {
    statusRef.current = next;
    setStatus(next);
    setUser(nextUser);
  }, []);

  const broadcast = useCallback(() => {
    try {
      channelRef.current?.postMessage("changed");
    } catch {
      /* ignore */
    }
  }, []);

  const openAuth = useCallback((view: AuthView = "signup") => {
    setPopupView(view);
    setPopupOpen(true);
  }, []);

  const closeAuth = useCallback(() => setPopupOpen(false), []);

  const setSignedIn = useCallback(
    (next: AuthUser) => {
      applyStatus("authenticated", next);
      broadcast();
    },
    [applyStatus, broadcast]
  );

  const signOut = useCallback(async () => {
    try {
      await fetch("/api/user/logout", { method: "POST", credentials: "same-origin" });
    } finally {
      applyStatus("unauthenticated", null);
      broadcast();
    }
  }, [applyStatus, broadcast]);

  // 1) Check authentication, and 2) schedule the popup — once per page load.
  useEffect(() => {
    let cancelled = false;

    const delay = new Promise<void>((resolve) => window.setTimeout(resolve, AUTO_OPEN_DELAY_MS));
    const check = fetchSession().then((result) => {
      if (!cancelled) applyStatus(result.status, result.user);
      return result.status;
    });

    Promise.all([delay, check]).then(([, checked]) => {
      if (cancelled) return;
      // Authentication is verified before display, and re-read from the ref in case the visitor
      // logged in (e.g. via the navbar) while we were waiting.
      if (checked !== "unauthenticated" || statusRef.current !== "unauthenticated") return;
      if (isAutoPopupExcluded(pathnameRef.current)) return;
      setPopupView("signup");
      setPopupOpen(true);
    });

    return () => {
      cancelled = true;
    };
  }, [applyStatus]);

  // Keep other tabs in sync: logging in or out in one tab updates (and, if needed, closes the popup in) the rest.
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;
    channel.onmessage = () => {
      fetchSession().then((result) => {
        if (result.status === "unknown") return;
        applyStatus(result.status, result.user);
        if (result.status === "authenticated") setPopupOpen(false);
      });
    };
    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, [applyStatus]);

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, popupOpen, popupView, openAuth, closeAuth, setSignedIn, signOut }),
    [status, user, popupOpen, popupView, openAuth, closeAuth, setSignedIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
