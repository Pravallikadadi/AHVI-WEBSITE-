import { cn } from "@/lib/utils";

export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center border border-ink/20 px-3.5 py-1.5 text-[10.5px] tracking-[0.14em] text-ink", className)}>
      {children}
    </span>
  );
}
