"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && theme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={toggle}
      suppressHydrationWarning
      className={cn(
        "grid h-[42px] w-[42px] shrink-0 place-items-center border border-ink/15 text-ink transition-colors hover:bg-ink/5",
        className
      )}
    >
      {isDark ? <Sun size={17} strokeWidth={1.5} /> : <Moon size={17} strokeWidth={1.5} />}
    </button>
  );
}
