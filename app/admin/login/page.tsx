"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { highlightAhvi } from "@/lib/ahvi-text";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email || undefined, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        return setError(data.error || "Incorrect credentials.");
      }

      router.push(params.get("next") || "/admin");
      router.refresh();
    } catch {
      setLoading(false);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-5">
      <form onSubmit={submit} className="w-full max-w-[380px] rounded-2xl border border-ink/10 p-8 shadow-sm">
        <div className="mb-1 font-condensed text-[26px] font-bold tracking-[0.08em]">{highlightAhvi("AHVI ADMIN")}</div>
        <p className="mb-6 text-[13.5px] text-muted">{highlightAhvi("Sign in with your Appwrite admin credentials.")}</p>

        <label className="mb-1.5 block text-[11px] tracking-[0.14em] text-muted">Email (optional if default)</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@ahvi.com"
          className="mb-4 w-full rounded-lg border border-ink/15 bg-bg px-4 py-3 text-[14px] placeholder:text-muted"
        />

        <label className="mb-1.5 block text-[11px] tracking-[0.14em] text-muted">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-1.5 w-full rounded-lg border border-ink/15 bg-bg px-4 py-3 text-[15px]"
          autoFocus
        />

        {error && <p className="mb-3 text-[13px] text-error">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3.5 text-[13px] tracking-[0.06em] text-bg hover:bg-black disabled:opacity-60"
        >
          {loading && <Loader2 size={14} className="animate-spin" />} Sign in
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg" />}>
      <LoginForm />
    </Suspense>
  );
}
