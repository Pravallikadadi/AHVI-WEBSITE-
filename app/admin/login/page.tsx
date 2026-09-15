"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    setLoading(false);
    if (!res.ok) return setError("Incorrect password.");
    router.push(params.get("next") || "/admin/blogs");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-5">
      <form onSubmit={submit} className="w-full max-w-[380px] rounded-2xl border border-ink/10 p-8">
        <div className="mb-1 font-condensed text-[26px] font-bold tracking-[0.08em]">AHVI ADMIN</div>
        <p className="mb-6 text-[13.5px] text-muted">Sign in to manage the AHVI blog.</p>
        <label className="mb-1.5 block text-[11px] tracking-[0.14em] text-muted">Password</label>
        <input
          type="password"
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
