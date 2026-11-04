"use client";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BlueprintFrame } from "@/components/blueprint-frame";
import { Loader2 } from "lucide-react";
import { trackFormStart, trackFormSubmit } from "@/lib/analytics-client";

export function ContactForm() {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [values, setValues] = useState({ name: "", email: "", subject: "", message: "", honeypot: "" });
  const [started, setStarted] = useState(false);

  const onFocus = () => {
    if (!started) {
      setStarted(true);
      trackFormStart("contact");
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.email || !values.message) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send message. Please try again.");
      }

      trackFormSubmit("contact", true);
      setDone(true);
    } catch (err: any) {
      trackFormSubmit("contact", false);
      setError(err?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <BlueprintFrame className="p-8 text-center sm:p-11">
        <h2 className="mb-2.5 font-condensed text-[28px] font-semibold">Message sent.</h2>
        <p className="text-[14.5px] text-muted">We'll reply from hello@ahvi.com.</p>
      </BlueprintFrame>
    );
  }

  return (
    <BlueprintFrame className="p-6 sm:p-8">
      <form onSubmit={onSubmit} onFocus={onFocus} className="grid gap-4">
        {/* Anti-spam honeypot (hidden from real users) */}
        <input
          type="text"
          name="website_hp"
          value={values.honeypot}
          onChange={(e) => setValues({ ...values, honeypot: e.target.value })}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        <div>
          <Label htmlFor="ct-name">Name</Label>
          <Input id="ct-name" value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="ct-email">Email</Label>
          <Input id="ct-email" type="email" required value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="ct-subject">Subject</Label>
          <Input id="ct-subject" value={values.subject} onChange={(e) => setValues({ ...values, subject: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="ct-message">Message</Label>
          <Textarea id="ct-message" rows={5} required value={values.message} onChange={(e) => setValues({ ...values, message: e.target.value })} />
        </div>

        {error && (
          <div className="rounded border border-error/30 bg-error/10 p-3 text-[13px] text-error">
            {error}
          </div>
        )}

        <Button type="submit" variant="primary" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 size={15} className="mr-2 animate-spin" /> Sending...
            </>
          ) : (
            "Send message"
          )}
        </Button>
        <div className="text-center text-[12px] text-muted2">or write to hello@ahvi.com</div>
      </form>
    </BlueprintFrame>
  );
}
