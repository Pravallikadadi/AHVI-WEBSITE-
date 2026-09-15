import { cn } from "@/lib/utils";

export function BlogStatusBadge({ status }: { status: "draft" | "published" }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 border px-3 py-1 text-[10.5px] tracking-[0.14em]",
        status === "published" ? "border-accent/40 text-accent" : "border-muted2/40 text-muted2"
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", status === "published" ? "bg-accent" : "bg-muted2")} />
      {status}
    </span>
  );
}
