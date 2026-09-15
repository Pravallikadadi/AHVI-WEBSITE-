export function TodaysPrep() {
  const rows = [
    { label: "Outfit", value: "Relaxed workwear" },
    { label: "Weather", value: "Comfortable layers" },
    { label: "Carry", value: "Bag, wallet, keys" },
    { label: "Occasion", value: "Workday" },
    { label: "Status", value: "Ready for the day" },
  ];
  return (
    <div className="border border-ink/10 bg-bg">
      <div className="flex items-baseline justify-between border-b border-ink/10 px-5 py-4">
        <span className="font-condensed text-[19px] tracking-[0.08em]">Today's Prep</span>
      </div>
      {rows.map((r) => (
        <div key={r.label} className="flex items-center justify-between border-b border-ink/[0.08] px-5 py-3.5 last:border-b-0">
          <span className="text-[11px] tracking-[0.14em] text-muted">{r.label}</span>
          <span className="text-[15px]">{r.value}</span>
        </div>
      ))}
    </div>
  );
}
