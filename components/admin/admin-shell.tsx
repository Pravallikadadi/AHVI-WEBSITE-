"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { highlightAhvi } from "@/lib/ahvi-text";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };
  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-ink/10">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/admin/blogs" className="font-condensed text-[22px] font-bold tracking-[0.1em]">
            {highlightAhvi("AHVI ADMIN")}
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/blog" target="_blank" className="text-[13px] text-muted hover:text-accent">
              View site ↗
            </Link>
            <button onClick={logout} className="flex items-center gap-1.5 text-[13px] text-muted hover:text-accent">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1200px] px-5 py-10 sm:px-8">{children}</main>
    </div>
  );
}
