import { cn } from "@/lib/utils";

export function Table({ children }: { children: React.ReactNode }) {
  return <table className="w-full text-left text-[14px]">{children}</table>;
}
export function THead({ children }: { children: React.ReactNode }) {
  return <thead className="border-b border-ink/10 text-[11px] tracking-[0.12em] text-muted">{children}</thead>;
}
export function TBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}
export function TR({ children }: { children: React.ReactNode }) {
  return <tr className="border-b border-ink/[0.08]">{children}</tr>;
}
export function TH({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={cn("py-3 pr-4 font-normal", className)}>{children}</th>;
}
export function TD({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn("py-3 pr-4", className)}>{children}</td>;
}
