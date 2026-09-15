import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/motion/magnetic-button";

export function WaitlistCta({ className, inverted }: { className?: string; inverted?: boolean }) {
  return (
    <MagneticButton strength={12}>
      <Link
        href="/waitlist"
        className={cn(
          "group inline-flex items-center gap-2.5 border px-7 py-4 text-[13px] font-semibold tracking-[0.1em] transition-colors duration-300",
          inverted
            ? "border-bg bg-bg text-ink hover:bg-transparent hover:text-bg"
            : "border-ink bg-ink text-bg hover:bg-transparent hover:text-ink",
          className
        )}
      >
        Join the Waitlist{" "}
        <ArrowRight size={15} className="transition-transform duration-300 ease-out group-hover:translate-x-1" />
      </Link>
    </MagneticButton>
  );
}
