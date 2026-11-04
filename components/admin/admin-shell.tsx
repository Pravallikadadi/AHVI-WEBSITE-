"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LogOut,
  LayoutDashboard,
  Users,
  Mail,
  HelpCircle,
  FileText,
  Send,
  ExternalLink,
} from "lucide-react";
import { highlightAhvi } from "@/lib/ahvi-text";

const NAV_ITEMS = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Waitlist", href: "/admin/waitlist", icon: Users },
  { label: "Contacts", href: "/admin/contacts", icon: Mail },
  { label: "Surveys", href: "/admin/surveys", icon: HelpCircle },
  { label: "Subscribers", href: "/admin/subscribers", icon: Send },
  { label: "Blog Stories", href: "/admin/blogs", icon: FileText },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-bg/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1300px] items-center justify-between px-5 py-3.5 sm:px-8">
          <Link href="/admin" className="font-condensed text-[22px] font-bold tracking-[0.1em]">
            {highlightAhvi("AHVI ADMIN")}
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-[12.5px] text-muted hover:text-ink"
            >
              <span>View live site</span> <ExternalLink size={12} />
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-full border border-ink/10 px-3 py-1 text-[12px] text-muted transition-colors hover:border-ink/30 hover:text-ink"
            >
              <LogOut size={13} /> Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mx-auto max-w-[1300px] overflow-x-auto px-5 sm:px-8">
          <nav className="flex gap-1 border-t border-ink/5 pt-1">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-3.5 py-2.5 text-[12.5px] font-medium tracking-[0.04em] transition-colors ${
                    active
                      ? "border-ink text-ink font-semibold"
                      : "border-transparent text-muted hover:border-ink/20 hover:text-ink"
                  }`}
                >
                  <Icon size={14} className={active ? "text-ink" : "text-muted"} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[1300px] px-5 py-8 sm:px-8">{children}</main>
    </div>
  );
}
