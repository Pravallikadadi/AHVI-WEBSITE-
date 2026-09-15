"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Text sits fully visible but greyed-out by default. On `active`, each letter brightens to the
 * full ink color at its own randomized delay, so the highlight ripples across letter-by-letter
 * rather than the whole line lighting up at once. Reverses the same way on deactivate.
 */
export function LetterHighlight({
  text,
  active,
  className,
  maxDelay = 450,
}: {
  text: string;
  active: boolean;
  className?: string;
  maxDelay?: number;
}) {
  // Randomized only after mount — computing this during SSR would produce a different value than
  // the client's first render and trigger a hydration mismatch.
  const [delays, setDelays] = useState(() => text.split("").map(() => 0));
  useEffect(() => {
    setDelays(text.split("").map(() => Math.random() * maxDelay));
  }, [text, maxDelay]);

  return (
    <span className={cn("text-muted2", className)}>
      {text.split("").map((c, i) => (
        <span
          key={i}
          className="transition-colors duration-300 ease-out"
          style={{
            transitionDelay: `${Math.round(delays[i])}ms`,
            color: active ? "rgb(var(--color-ink))" : undefined,
          }}
        >
          {c}
        </span>
      ))}
    </span>
  );
}
