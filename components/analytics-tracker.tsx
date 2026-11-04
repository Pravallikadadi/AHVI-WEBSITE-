"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView, trackClick, flushQueue } from "@/lib/analytics-client";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track pageviews on route change
  useEffect(() => {
    if (!pathname) return;
    trackPageView(pathname);
  }, [pathname, searchParams]);

  // Global click & interaction tracker
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest("a, button, [role='button']");
      if (!interactive) return;

      // Extract a safe label (never collect input values or passwords)
      let label =
        interactive.getAttribute("data-analytics") ||
        interactive.getAttribute("aria-label") ||
        interactive.textContent?.trim().slice(0, 40) ||
        interactive.tagName.toLowerCase();

      // Mask any potential sensitive content
      if (label.length > 50) label = label.slice(0, 50);

      const href = interactive.getAttribute("href");
      trackClick(label, href ? { href: href.slice(0, 100) } : undefined);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flushQueue();
      }
    };

    window.addEventListener("click", handleClick, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", flushQueue);

    return () => {
      window.removeEventListener("click", handleClick);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", flushQueue);
    };
  }, []);

  return null;
}
