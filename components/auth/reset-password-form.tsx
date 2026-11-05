"use client";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth/auth-provider";

export function ResetPasswordForm() {
  const params = useSearchParams();
  const { openAuth } = useAuth();
  const userId = params.get("userId") || "";
  const secret = params.get("secret") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const invalidLink = !userId || !secret;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("Password must be at least 8 characters");
    if (password !== confirm) return setError("Passwords don't match");
    setLoading(true);
    try {
      const res = await fetch("/api/user/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, secret, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return setError(data.error || "Couldn't reset your password. Please try again.");
      setDone(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-[440px] flex-col justify-center px-5 py-16">
      {done ? (
        <div className="text-center" data-testid="reset-success">
          <CheckCircle2 size={34} strokeWidth={1.5} className="mx-auto mb-4 text-accent" />
          <h1 className="mb-2 font-condensed text-[30px] font-semibold">Password updated</h1>
          <p className="mb-6 text-[14.5px] text-muted">You can now log in with your new password.</p>
          <Button type="button" onClick={() => openAuth("login")} className="w-full">
            Log in
          </Button>
        </div>
      ) : invalidLink ? (
        <div className="text-center">
          <h1 className="mb-2 font-condensed text-[30px] font-semibold">Reset link invalid</h1>
          <p className="mb-6 text-[14.5px] text-muted">This link is incomplete or has expired. Request a new one from the log in screen.</p>
          <Button type="button" onClick={() => openAuth("login")} className="w-full">
            Back to log in
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="grid gap-4" data-testid="reset-form">
          <h1 className="font-condensed text-[30px] font-semibold leading-[1.1]">Set a new password</h1>
          <p className="text-[14.5px] text-muted">Choose a password with at least 8 characters.</p>
          {[
            { id: "np", label: "NEW PASSWORD", v: password, set: setPassword },
            { id: "cp", label: "CONFIRM PASSWORD", v: confirm, set: setConfirm },
          ].map((f) => (
            <div key={f.id}>
              <label htmlFor={f.id} className="mb-1.5 block text-[11px] tracking-[0.14em] text-muted">
                {f.label}
              </label>
              <div className="relative">
                <Lock size={16} strokeWidth={1.6} aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted2" />
                <Input id={f.id} type="password" autoComplete="new-password" maxLength={128} className="h-12 pl-11 text-[16px]" value={f.v} onChange={(e) => f.set(e.target.value)} />
              </div>
            </div>
          ))}
          {error && <p role="alert" className="border border-error/40 bg-error/5 px-4 py-3 text-[13px] text-error">{error}</p>}
          <Button type="submit" disabled={loading} className="h-12 w-full py-0">
            {loading && <Loader2 size={16} className="animate-spin" aria-hidden />} Update password
          </Button>
          <Link href="/" className="text-center text-[13px] text-muted hover:text-ink">Back to home</Link>
        </form>
      )}
    </div>
  );
}
