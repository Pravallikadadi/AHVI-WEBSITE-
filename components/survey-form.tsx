"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BlueprintFrame } from "@/components/blueprint-frame";
import { highlightAhvi } from "@/lib/ahvi-text";
import { Loader2 } from "lucide-react";
import { trackFormStart, trackFormSubmit } from "@/lib/analytics-client";

const OPTIONS = ["Style", "Wardrobe", "Shopping", "Lifestyle", "Wellness", "All"];

export function SurveyForm() {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [want, setWant] = useState<string[]>([]);
  const [challenge, setChallenge] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [started, setStarted] = useState(false);

  const toggle = (o: string) => setWant((w) => (w.includes(o) ? w.filter((x) => x !== o) : [...w, o]));

  const onFocus = () => {
    if (!started) {
      setStarted(true);
      trackFormStart("survey");
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (want.length === 0) {
      setError("Please select at least one area of interest.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ want, challenge, honeypot }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit survey. Please try again.");
      }

      trackFormSubmit("survey", true);
      setDone(true);
    } catch (err: any) {
      trackFormSubmit("survey", false);
      setError(err?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
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
    <form onSubmit={onSubmit} onFocus={onFocus}>
      {/* Anti-spam honeypot */}
      <input
        type="text"
        name="survey_validate_hp"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="mb-8">
        <div className="mb-3.5 text-[15px] font-medium">{highlightAhvi("What would you want AHVI to help with?")}</div>
        <div className="flex flex-wrap gap-2.5">
          {OPTIONS.map((o) => (
            <button
              type="button"
              key={o}
              onClick={() => toggle(o)}
              className={"border border-ink px-4.5 py-2.5 text-[13px] transition-colors " + (want.includes(o) ? "bg-ink text-bg" : "bg-transparent text-ink")}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <Label htmlFor="challenge">What is your biggest wardrobe challenge?</Label>
        <Textarea
          id="challenge"
          rows={4}
          value={challenge}
          onChange={(e) => setChallenge(e.target.value)}
          placeholder="Tell us honestly..."
        />
      </div>

      {error && (
        <div className="mb-6 rounded border border-error/30 bg-error/10 p-3 text-[13px] text-error">
          {error}
        </div>
      )}

      <Button type="submit" variant="primary" disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 size={15} className="mr-2 animate-spin" /> Submitting...
          </>
        ) : (
          "Continue to waitlist"
        )}
      </Button>
    </form>
  );
}
