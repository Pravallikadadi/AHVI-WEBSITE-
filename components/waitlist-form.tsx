"use client";
import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { BlueprintFrame } from "@/components/blueprint-frame";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const INTERESTS = ["Style", "Prep", "Plan"] as const;

export function WaitlistForm() {
  const [done, setDone] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", phone: "" });
  const [interests, setInterests] = useState<string[]>([]);

  const toggleInterest = (i: string) => setInterests((cur) => (cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.name || !values.email) return;
    // No backend exists yet — wire this handler up to a real waitlist API/service.
    setDone(true);
  };

  if (done) {
    return (
      <BlueprintFrame className="p-8 text-center sm:p-11">
        <CheckCircle2 size={30} className="mx-auto mb-4 text-accent" strokeWidth={1.5} />
        <h2 className="mb-2.5 font-condensed text-[30px] font-semibold">You're on the list.</h2>
        <p className="mb-5 text-[14.5px] text-muted">We'll reach out as AHVI opens up seats.</p>
        <Link href="/" className="text-[12.5px] tracking-[0.1em] text-accent">
          Back home
        </Link>
      </BlueprintFrame>
    );
  }

  return (
    <BlueprintFrame className="p-6 sm:p-8">
      <form onSubmit={onSubmit} className="grid gap-4">
        <div>
          <Label htmlFor="wl-name">Name</Label>
          <Input id="wl-name" required value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} placeholder="Your name" />
        </div>
        <div>
          <Label htmlFor="wl-email">Email</Label>
          <Input
            id="wl-email"
            type="email"
            required
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            placeholder="you@email.com"
          />
        </div>
        <div>
          <Label htmlFor="wl-phone">Phone (optional)</Label>
          <Input id="wl-phone" value={values.phone} onChange={(e) => setValues({ ...values, phone: e.target.value })} placeholder="+91" />
        </div>
        <div>
          <Label>What are you most interested in? (optional)</Label>
          <div className="mt-1.5 flex gap-2">
            {INTERESTS.map((i) => (
              <button
                key={i}
                type="button"
                aria-pressed={interests.includes(i)}
                onClick={() => toggleInterest(i)}
                className={
                  "flex-1 border px-3 py-2.5 text-[12px] tracking-[0.1em] transition-colors " +
                  (interests.includes(i) ? "border-ink bg-ink text-bg" : "border-ink/20 text-muted hover:border-ink/40")
                }
              >
                {i}
              </button>
            ))}
          </div>
        </div>
        <Button type="submit" variant="primary" className="mt-1 w-full">
          Join the Waitlist
        </Button>
      </form>
    </BlueprintFrame>
  );
}
