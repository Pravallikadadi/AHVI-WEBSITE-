"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BlueprintFrame } from "@/components/blueprint-frame";
import { highlightAhvi } from "@/lib/ahvi-text";

const OPTIONS = ["Style", "Wardrobe", "Shopping", "Lifestyle", "Wellness", "All"];

export function SurveyForm() {
  const [done, setDone] = useState(false);
  const [want, setWant] = useState<string[]>([]);
  const [challenge, setChallenge] = useState("");

  const toggle = (o: string) => setWant((w) => (w.includes(o) ? w.filter((x) => x !== o) : [...w, o]));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No backend exists yet — wire this handler up to a real survey-response API.
    setDone(true);
  };

  if (done) {
    return (
      <BlueprintFrame className="p-8 text-center sm:p-11">
        <h2 className="mb-2.5 font-condensed text-[28px] font-semibold">Thank you.</h2>
        <p className="mb-5 text-[14.5px] text-muted">{highlightAhvi("This shapes what AHVI builds next.")}</p>
        <Button asChild variant="primary">
          <Link href="/waitlist">Join the Waitlist</Link>
        </Button>
      </BlueprintFrame>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-8">
        <div className="mb-3.5 text-[15px] font-medium">{highlightAhvi("What would you want AHVI to help with?")}</div>
        <div className="flex flex-wrap gap-2.5">
          {OPTIONS.map((o) => (
            <button
              type="button"
              key={o}
              onClick={() => toggle(o)}
              className={"border border-ink px-4.5 py-2.5 text-[13px] " + (want.includes(o) ? "bg-ink text-bg" : "bg-transparent text-ink")}
            >
              {o}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-8">
        <Label htmlFor="challenge">What is your biggest wardrobe challenge?</Label>
        <Textarea id="challenge" rows={4} value={challenge} onChange={(e) => setChallenge(e.target.value)} placeholder="Tell us honestly..." />
      </div>
      <Button type="submit" variant="primary" className="w-full">
        Continue to waitlist
      </Button>
    </form>
  );
}
