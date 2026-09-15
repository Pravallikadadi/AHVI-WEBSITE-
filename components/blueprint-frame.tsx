import { cn } from "@/lib/utils";

export function BlueprintFrame({
  children,
  className,
  dark,
}: {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div className={cn("relative border", dark ? "border-bg/15" : "border-ink/10", className)}>
      <span className={cn("pointer-events-none absolute left-0 top-0 h-2.5 w-2.5 border-l border-t", dark ? "border-goldsoft/50" : "border-gold/60")} />
      <span className={cn("pointer-events-none absolute right-0 top-0 h-2.5 w-2.5 border-r border-t", dark ? "border-goldsoft/50" : "border-gold/60")} />
      <span className={cn("pointer-events-none absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l", dark ? "border-goldsoft/50" : "border-gold/60")} />
      <span className={cn("pointer-events-none absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r", dark ? "border-goldsoft/50" : "border-gold/60")} />
      {children}
    </div>
  );
}
