import { Layers, Camera, Shirt, CalendarCheck, Sparkles, Dumbbell, Brain, Luggage, PartyPopper, Receipt } from "lucide-react";
import type { PremiumFeature } from "@/lib/pricing-data";

const ICONS = {
  layers: Layers,
  camera: Camera,
  shirt: Shirt,
  "calendar-check": CalendarCheck,
  sparkles: Sparkles,
  dumbbell: Dumbbell,
  brain: Brain,
  luggage: Luggage,
  "party-popper": PartyPopper,
  receipt: Receipt,
};

export function FeatureCard({ feature }: { feature: PremiumFeature }) {
  const Icon = ICONS[feature.icon];
  return (
    <div className="group flex h-full flex-col border border-ink/10 bg-bg p-6 transition-all duration-300 hover:border-gold/40">
      <div className="mb-5 grid h-11 w-11 place-items-center border border-ink/10 text-ink transition-colors duration-300 group-hover:bg-ink group-hover:text-goldsoft">
        <Icon size={19} strokeWidth={1.5} />
      </div>
      <div className="font-condensed text-[17px] font-semibold text-ink">{feature.title}</div>
      <span className="mt-4 h-px w-8 bg-gold/0 transition-all duration-300 group-hover:w-14 group-hover:bg-gold/60" />
    </div>
  );
}
