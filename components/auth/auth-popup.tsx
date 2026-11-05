"use client";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MailCheck,
  Shirt,
  Sparkles,
  User,
  X,
  type LucideIcon,
} from "lucide-react";

import { AhviLogo } from "@/components/ahvi-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth, type AuthUser } from "@/components/auth/auth-provider";
import { highlightAhvi } from "@/lib/ahvi-text";
import { cn } from "@/lib/utils";

type PopupView = "signup" | "login" | "forgot" | "forgot-sent" | "success";
type FieldErrors = Partial<Record<"name" | "email" | "password", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const EASE = [0.16, 1, 0.3, 1] as const;
const SUCCESS_CLOSE_MS = 1800;

function validate(view: PopupView, v: { name: string; email: string; password: string }): FieldErrors {
  const errors: FieldErrors = {};
  if (view === "signup" && v.name.trim().length < 2) errors.name = "Please enter your name";
  if (!EMAIL_RE.test(v.email.trim())) errors.email = "Please enter a valid email address";
  if (view === "signup" && v.password.length < 8) errors.password = "Use at least 8 characters";
  if (view === "login" && !v.password) errors.password = "Please enter your password";
  return errors;
}

function passwordStrength(pw: string): { score: number; label: string } {
  if (!pw) return { score: 0, label: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  else if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score += 0.5;
  const s = Math.min(4, Math.max(1, Math.floor(score)));
  return { score: s, label: ["", "Weak", "Okay", "Good", "Strong"][s] };
}

async function postJson(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data } as { ok: boolean; status: number; data: Record<string, any> };
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ small building blocks â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

function Field({
  id,
  label,
  icon: Icon,
  error,
  trailing,
  inputProps,
  labelAside,
}: {
  id: string;
  label: string;
  icon: LucideIcon;
  error?: string;
  trailing?: React.ReactNode;
  labelAside?: React.ReactNode;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="block text-[11px] tracking-[0.14em] text-muted">
          {label}
        </label>
        {labelAside}
      </div>
      <div className="relative">
        <Icon
          size={16}
          strokeWidth={1.6}
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted2"
        />
        <Input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "h-12 pl-11 text-[16px] transition-colors focus-visible:border-ink",
            trailing ? "pr-12" : "pr-4",
            error && "border-error"
          )}
          {...inputProps}
        />
        {trailing}
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-[12.5px] text-error">
          {error}
        </p>
      )}
    </div>
  );
}

function StrengthMeter({ password }: { password: string }) {
  const { score, label } = passwordStrength(password);
  if (!password) return null;
  return (
    <div className="mt-2.5 flex items-center gap-3" aria-live="polite">
      <div className="flex flex-1 gap-1" aria-hidden>
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={cn(
              "h-[3px] flex-1 transition-colors duration-300",
              i <= score ? "bg-gradient-to-r from-brandFrom to-brandTo" : "bg-ink/10"
            )}
          />
        ))}
      </div>
      <span className="w-12 text-right text-[11.5px] text-muted">{label}</span>
    </div>
  );
}

function PrimaryButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <Button type="submit" disabled={loading} className="group relative h-12 w-full overflow-hidden py-0">
      {loading ? <Loader2 size={16} className="animate-spin" aria-hidden /> : null}
      <span>{children}</span>
      {!loading && (
        <ArrowRight size={14} aria-hidden className="transition-transform duration-300 group-hover:translate-x-1" />
      )}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-brandFrom via-brandVia to-brandTo"
      />
    </Button>
  );
}

function Tabs({
  view,
  onChange,
  baseId,
}: {
  view: "signup" | "login";
  onChange: (v: "signup" | "login") => void;
  baseId: string;
}) {
  const tabs = [
    { id: "signup" as const, label: "Create account" },
    { id: "login" as const, label: "Log in" },
  ];
  return (
    <div
      role="tablist"
      aria-label="Account"
      className="relative mb-6 grid grid-cols-2 gap-1 bg-surface p-1"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          onChange(view === "signup" ? "login" : "signup");
          requestAnimationFrame(() =>
            document.getElementById(`${baseId}-tab-${view === "signup" ? "login" : "signup"}`)?.focus()
          );
        }
      }}
    >
      {/* Sliding pill is a plain CSS transition (not a framer layoutId) so it can't hold up AnimatePresence exits. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-6px)] bg-bg shadow-[0_1px_2px_rgba(0,0,0,0.12),0_0_0_1px_rgba(var(--color-ink),0.06)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
        style={{ transform: view === "login" ? "translateX(calc(100% + 4px))" : "translateX(0)" }}
      />
      {tabs.map((t) => {
        const active = view === t.id;
        return (
          <button
            key={t.id}
            id={`${baseId}-tab-${t.id}`}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={`${baseId}-panel`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(t.id)}
            className={cn(
              "relative h-10 text-[13.5px] font-medium transition-colors",
              active ? "text-ink" : "text-muted hover:text-ink"
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

const PERKS: { icon: React.ElementType; text: string; isAhvi?: boolean }[] = [
  { icon: Shirt, text: "Your wardrobe, understood piece by piece" },
  { icon: AhviLogo, text: "Styling ideas that fit your taste and lifestyle", isAhvi: true },
  { icon: CalendarCheck, text: "Prep and plans for everything coming up" },
];

function BrandPanel() {
  return (
    <aside
      aria-hidden
      className="relative hidden w-[41%] shrink-0 flex-col justify-between overflow-hidden bg-[#0A0A0A] p-10 text-white md:flex"
    >
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brandFrom/45 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-brandTo/30 blur-[90px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent_55%)]" />

      <div className="relative flex items-center gap-1.5 text-[34px] tracking-[0.1em]">
        <AhviLogo size={28} className="text-white" />
        <span className="ahvi-wordmark">AHVI</span>
      </div>

      <div className="relative">
        <p className="mb-3 text-[11px] tracking-[0.2em] text-white/55">YOUR PERSONAL AI STYLIST</p>
        <h2 className="mb-7 font-condensed text-[32px] font-semibold leading-[1.1]">
          Know what to wear, every day.
        </h2>
        <ul className="grid gap-4">
          {PERKS.map(({ icon: Icon, text, isAhvi }) => (
            <li key={text} className="flex items-start gap-3 text-[14px] leading-[20px] text-white/75">
              <span className="mt-[1px] grid h-7 w-7 shrink-0 place-items-center border border-white/20 bg-white/5">
                {isAhvi ? <Icon size={18} className="text-white" /> : <Icon size={14} strokeWidth={1.6} />}
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ the popup â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

function PopupContent() {
  const { popupView, closeAuth, setSignedIn } = useAuth();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const descId = `${baseId}-desc`;

  const dialogRef = useRef<HTMLDivElement>(null);
  const initialPath = useRef(pathname);

  const [view, setView] = useState<PopupView>(popupView);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [welcome, setWelcome] = useState<{ user: AuthUser; kind: "signup" | "login" } | null>(null);

  // Close when the visitor navigates elsewhere (e.g. via the Terms/Privacy links).
  useEffect(() => {
    if (pathname !== initialPath.current) closeAuth();
  }, [pathname, closeAuth]);

  // Modal behaviour: scroll lock, Escape, focus trap, focus restore.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus({ preventScroll: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeAuth();
        return;
      }
      if (e.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const focusables = Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === root)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      } else if (!root.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [closeAuth]);

  // Success screen auto-dismisses.
  useEffect(() => {
    if (view !== "success") return;
    const t = window.setTimeout(closeAuth, SUCCESS_CLOSE_MS);
    return () => window.clearTimeout(t);
  }, [view, closeAuth]);

  const go = useCallback((next: PopupView) => {
    setView(next);
    setErrors({});
    setFormError("");
    setNotice("");
    setShowPassword(false);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || (view !== "signup" && view !== "login" && view !== "forgot")) return;

    const fieldErrors = validate(view, { name, email, password: view === "forgot" ? "x".repeat(8) : password });
    setErrors(fieldErrors);
    setFormError("");
    setNotice("");
    if (Object.keys(fieldErrors).length > 0) {
      const firstKey = (["name", "email", "password"] as const).find((k) => fieldErrors[k]);
      if (firstKey) document.getElementById(`${baseId}-${firstKey}`)?.focus();
      return;
    }

    setLoading(true);
    try {
      if (view === "signup") {
        const { ok, data } = await postJson("/api/user/signup", {
          name: name.trim(),
          email: email.trim(),
          password,
          honeypot,
        });
        if (!ok) {
          if (data.code === "signup_session_failed") {
            go("login");
            setNotice("Your account was created. Please log in to continue.");
            return;
          }
          setFormError(data.error || "Sign up failed. Please try again.");
          return;
        }
        setSignedIn(data.user);
        setWelcome({ user: data.user, kind: "signup" });
        go("success");
      } else if (view === "login") {
        const { ok, data } = await postJson("/api/user/login", { email: email.trim(), password });
        if (!ok) {
          setFormError(data.error || "Login failed. Please try again.");
          return;
        }
        setSignedIn(data.user);
        setWelcome({ user: data.user, kind: "login" });
        go("success");
      } else {
        const { ok, data } = await postJson("/api/user/forgot-password", { email: email.trim() });
        if (!ok) {
          setFormError(data.error || "Couldn't send the reset email. Please try again.");
          return;
        }
        go("forgot-sent");
      }
    } catch {
      setFormError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const heading: Record<PopupView, { title: string; sub: string }> = {
    signup: { title: "Create your account", sub: "Join AHVI and start styling smarter, every day." },
    login: { title: "Welcome back", sub: "Log in to pick up right where you left off." },
    forgot: { title: "Reset your password", sub: "Enter your email and we'll send you a link to set a new one." },
    "forgot-sent": { title: "Check your inbox", sub: "" },
    success: { title: "", sub: "" },
  };

  const passwordToggle = (
    <button
      type="button"
      onClick={() => setShowPassword((s) => !s)}
      aria-label={showPassword ? "Hide password" : "Show password"}
      aria-pressed={showPassword}
      className="absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center text-muted2 transition-colors hover:text-ink"
    >
      {showPassword ? <EyeOff size={16} strokeWidth={1.6} /> : <Eye size={16} strokeWidth={1.6} />}
    </button>
  );

  const isTabbed = view === "signup" || view === "login";
  const panelMotion = {
    initial: { opacity: 0, y: reduce ? 0 : 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reduce ? 0 : -6 },
    transition: { duration: 0.22, ease: EASE },
  };

  return (
    <motion.div
      data-lenis-prevent
      className="fixed inset-0 z-[120] flex items-end justify-center bg-black/55 backdrop-blur-[6px] sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeAuth();
      }}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
        data-testid="auth-popup"
        className="spark-card flex max-h-[94dvh] w-full flex-col rounded-t-2xl shadow-[0_30px_120px_-20px_rgba(0,0,0,0.65)] outline-none sm:max-h-[min(740px,92dvh)] sm:max-w-[900px] sm:rounded-2xl"
        initial={{ opacity: 0, y: reduce ? 0 : 36, scale: reduce ? 1 : 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: reduce ? 0 : 24 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <span className="spark-card__border" aria-hidden style={{ zIndex: 20 }} />

        <button
          type="button"
          onClick={closeAuth}
          aria-label="Close"
          data-testid="auth-popup-close"
          className="absolute right-3 top-3 z-30 grid h-10 w-10 place-items-center rounded-full text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col md:min-h-[600px] md:flex-row">
          <BrandPanel />

          <div className="auth-popup-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-8 pt-5 sm:px-10 sm:pb-10 md:pt-12">
            {/* Compact brand row for small screens (the dark panel is desktop-only) */}
            <div className="mb-6 flex items-center gap-1.5 text-[26px] tracking-[0.1em] text-ink md:hidden" aria-hidden>
              <AhviLogo size={22} />
              <span className="ahvi-wordmark">AHVI</span>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {view === "success" && welcome ? (
                <motion.div key="success" {...panelMotion} className="grid place-items-center py-10 text-center md:py-16">
                  <span className="mb-6 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-brandFrom via-brandVia to-brandTo text-white shadow-[0_10px_40px_-8px_rgba(99,102,241,0.7)]">
                    <Check size={28} strokeWidth={2} />
                  </span>
                  <h2 id={titleId} className="mb-2 font-condensed text-[30px] font-semibold leading-[1.1]">
                    {welcome.kind === "signup" ? "Welcome to " : "Welcome back"}
                    {welcome.kind === "signup" && <span className="ahvi-wordmark">AHVI</span>}
                    {welcome.user.name ? `, ${welcome.user.name.split(" ")[0]}` : ""}
                  </h2>
                  <p id={descId} className="mb-7 text-[14.5px] text-muted" role="status">
                    {welcome.kind === "signup" ? "Your account is ready â€” you're signed in." : "You're signed in."}
                  </p>
                  <Button type="button" onClick={closeAuth} variant="outline" size="sm">
                    Continue
                  </Button>
                </motion.div>
              ) : view === "forgot-sent" ? (
                <motion.div key="forgot-sent" {...panelMotion}>
                  <span className="mb-5 grid h-12 w-12 place-items-center border border-ink/15 text-ink">
                    <MailCheck size={20} strokeWidth={1.5} />
                  </span>
                  <h2 id={titleId} className="mb-2 font-condensed text-[28px] font-semibold leading-[1.1] sm:text-[32px]">
                    Check your inbox
                  </h2>
                  <p id={descId} className="mb-7 text-[14.5px] leading-[22px] text-muted" role="status">
                    If an account exists for <span className="font-medium text-ink">{email.trim()}</span>, a password
                    reset link is on its way. It can take a minute to arrive â€” check your spam folder too.
                  </p>
                  <Button type="button" onClick={() => go("login")} className="h-12 w-full py-0">
                    <ArrowLeft size={14} aria-hidden /> Back to log in
                  </Button>
                </motion.div>
              ) : (
                <motion.div key={view === "forgot" ? "forgot" : "tabs"} {...panelMotion}>
                  {view === "forgot" && (
                    <button
                      type="button"
                      onClick={() => go("login")}
                      className="mb-5 inline-flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-ink"
                    >
                      <ArrowLeft size={14} aria-hidden /> Back to log in
                    </button>
                  )}

                  {isTabbed && (
                    <Tabs view={view as "signup" | "login"} onChange={(v) => go(v)} baseId={baseId} />
                  )}

                  <div
                    id={`${baseId}-panel`}
                    role={isTabbed ? "tabpanel" : undefined}
                    aria-labelledby={isTabbed ? `${baseId}-tab-${view}` : undefined}
                  >
                    <h2 id={titleId} className="mb-1.5 font-condensed text-[28px] font-semibold leading-[1.1] sm:text-[32px]">
                      {heading[view].title}
                    </h2>
                    <p id={descId} className="mb-6 text-[14.5px] leading-[22px] text-muted">
                      {highlightAhvi(heading[view].sub)}
                    </p>

                    <form onSubmit={onSubmit} noValidate className="grid gap-4" data-testid={`auth-form-${view}`}>
                      {view === "signup" && (
                        <Field
                          id={`${baseId}-name`}
                          label="FULL NAME"
                          icon={User}
                          error={errors.name}
                          inputProps={{
                            type: "text",
                            name: "name",
                            autoComplete: "name",
                            placeholder: "Your name",
                            value: name,
                            onChange: (e) => setName(e.target.value),
                            maxLength: 80,
                          }}
                        />
                      )}

                      <Field
                        id={`${baseId}-email`}
                        label="EMAIL"
                        icon={Mail}
                        error={errors.email}
                        inputProps={{
                          type: "email",
                          name: "email",
                          autoComplete: "email",
                          inputMode: "email",
                          autoCapitalize: "none",
                          spellCheck: false,
                          placeholder: "you@example.com",
                          value: email,
                          onChange: (e) => setEmail(e.target.value),
                          maxLength: 254,
                        }}
                      />

                      {view !== "forgot" && (
                        <div>
                          <Field
                            id={`${baseId}-password`}
                            label="PASSWORD"
                            icon={Lock}
                            error={errors.password}
                            trailing={passwordToggle}
                            labelAside={
                              view === "login" ? (
                                <button
                                  type="button"
                                  onClick={() => go("forgot")}
                                  className="text-[12.5px] text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
                                >
                                  Forgot password?
                                </button>
                              ) : undefined
                            }
                            inputProps={{
                              type: showPassword ? "text" : "password",
                              name: "password",
                              autoComplete: view === "signup" ? "new-password" : "current-password",
                              placeholder: view === "signup" ? "At least 8 characters" : "Your password",
                              value: password,
                              onChange: (e) => setPassword(e.target.value),
                              maxLength: 128,
                            }}
                          />
                          {view === "signup" && <StrengthMeter password={password} />}
                        </div>
                      )}

                      {view === "signup" && (
                        // Honeypot: invisible to people, tempting to bots.
                        <input
                          type="text"
                          name="website"
                          tabIndex={-1}
                          autoComplete="off"
                          aria-hidden
                          value={honeypot}
                          onChange={(e) => setHoneypot(e.target.value)}
                          className="absolute -left-[9999px] h-0 w-0 opacity-0"
                        />
                      )}

                      {notice && (
                        <p role="status" className="border border-ink/10 bg-surface px-4 py-3 text-[13px] text-ink">
                          {notice}
                        </p>
                      )}
                      {formError && (
                        <p
                          role="alert"
                          data-testid="auth-form-error"
                          className="border border-error/40 bg-error/5 px-4 py-3 text-[13px] text-error"
                        >
                          {formError}
                        </p>
                      )}

                      <PrimaryButton loading={loading}>
                        {view === "signup" ? "Create account" : view === "login" ? "Log in" : "Send reset link"}
                      </PrimaryButton>
                    </form>

                    {view === "signup" && (
                      <p className="mt-5 text-[12px] leading-[18px] text-muted2">
                        By creating an account you agree to our{" "}
                        <Link href="/legal/terms" className="underline underline-offset-2 hover:text-ink">
                          Terms
                        </Link>{" "}
                        and{" "}
                        <Link href="/legal/privacy" className="underline underline-offset-2 hover:text-ink">
                          Privacy Policy
                        </Link>
                        .
                      </p>
                    )}

                    {isTabbed && (
                      <p className="mt-5 text-[13px] text-muted">
                        {view === "signup" ? "Already have an account? " : "New to AHVI? "}
                        <button
                          type="button"
                          onClick={() => go(view === "signup" ? "login" : "signup")}
                          className="font-medium text-ink underline-offset-4 hover:underline"
                        >
                          {view === "signup" ? "Log in" : "Create an account"}
                        </button>
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function AuthPopup() {
  const { popupOpen } = useAuth();
  return <AnimatePresence>{popupOpen && <PopupContent key="auth-popup" />}</AnimatePresence>;
}


