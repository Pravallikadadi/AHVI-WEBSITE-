"use client";
import { useEffect, useState } from "react";
import { AhviLogo } from "@/components/ahvi-logo";
import { cn } from "@/lib/utils";

/** Full-screen loading state built from the AHVI logo's own orbit animation — shown on route/data loads and slow connections. */
export function AhviLoader({
  label = "Loading",
  fullScreen = true,
  className,
}: {
  label?: string;
  fullScreen?: boolean;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Skip the flash for loads that resolve almost instantly.
    const t = setTimeout(() => setVisible(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 bg-bg text-ink transition-opacity duration-300",
        fullScreen && "fixed inset-0 z-[100]",
        visible ? "opacity-100" : "opacity-0",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <AhviLogo size={56} />
      {label && <span className="text-[11.5px] font-medium tracking-[0.22em] text-muted">{label.toUpperCase()}</span>}
    </div>
  );
}
