"use client";
import { useEffect, useRef, useState } from "react";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { useToast } from "@/lib/toast";

/** Navbar control: "log in" entry point for visitors, account dropdown (with log out) once signed in. */
export function AccountMenu() {
  const { status, user, openAuth, signOut } = useAuth();
  const { push } = useToast();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (status === "unauthenticated") {
    return (
      <button
        type="button"
        aria-label="Log in or create an account"
        data-testid="navbar-login"
        onClick={() => openAuth("login")}
        className="grid h-[42px] w-[42px] place-items-center border border-ink/15 text-ink transition-colors hover:bg-ink/5"
      >
        <User size={18} strokeWidth={1.5} />
      </button>
    );
  }

  if (status === "authenticated" && user) {
    const initial = (user.name || user.email || "A").trim().charAt(0).toUpperCase();
    return (
      <div ref={ref} className="relative">
        <button
          type="button"
          aria-label="Account menu"
          aria-haspopup="menu"
          aria-expanded={open}
          data-testid="navbar-account"
          onClick={() => setOpen((o) => !o)}
          className="grid h-[42px] w-[42px] place-items-center border border-ink bg-ink text-[14px] font-medium text-bg transition-opacity hover:opacity-85"
        >
          {initial}
        </button>
        {open && (
          <div
            role="menu"
            className="absolute right-0 top-full z-50 mt-2 w-[230px] border border-ink/10 bg-bg p-1.5 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.35)]"
          >
            <div className="border-b border-ink/10 px-3 py-2.5">
              {user.name && <p className="truncate text-[14px] font-medium text-ink">{user.name}</p>}
              <p className="truncate text-[12.5px] text-muted">{user.email}</p>
            </div>
            <button
              type="button"
              role="menuitem"
              data-testid="navbar-logout"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                await signOut();
                setBusy(false);
                setOpen(false);
                push("You've been logged out");
              }}
              className="mt-1 flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-[14px] text-ink transition-colors hover:bg-ink/5 disabled:opacity-60"
            >
              <LogOut size={15} strokeWidth={1.6} /> Log out
            </button>
          </div>
        )}
      </div>
    );
  }

  // loading / unavailable / unknown: reserve the space so the header doesn't shift.
  return <span aria-hidden className="inline-block h-[42px] w-[42px]" />;
}
