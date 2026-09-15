export function SectionLabel({ label, dark }: { label: string; dark?: boolean }) {
  return (
    <div className={"text-[12px] font-bold tracking-[0.28em] " + (dark ? "text-bg" : "text-ink")}>{label}</div>
  );
}
