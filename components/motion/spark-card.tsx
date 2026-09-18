import { cn } from "@/lib/utils";

/** Rich gradient-wash card with a spark that continuously runs around the border and a shine sweep on hover. */
export function SparkCard({
  children,
  className,
  delay = 0,
  active,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Forces the border/sheen into their hover-like state — used for JS-driven "active" highlighting (e.g. an auto-advancing carousel) rather than actual pointer hover. */
  active?: boolean;
}) {
  return (
    <div
      className={cn("spark-card h-full", active && "is-active")}
      style={{ ["--spark-delay" as string]: `${-delay}s` }}
    >
      <span className="spark-card__border" aria-hidden />
      <span className="spark-card__sheen" aria-hidden />
      <div className={cn("relative z-10 h-full", className)}>{children}</div>
    </div>
  );
}
