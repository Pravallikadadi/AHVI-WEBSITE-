"use client";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BlueprintFrame } from "@/components/blueprint-frame";

export function ContactForm() {
  const [done, setDone] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", subject: "", message: "" });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.email) return;
    // No backend exists yet — wire this handler up to a real contact/email API.
    setDone(true);
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
      <form onSubmit={onSubmit} className="grid gap-4">
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
          <Textarea id="ct-message" rows={5} value={values.message} onChange={(e) => setValues({ ...values, message: e.target.value })} />
        </div>
        <Button type="submit" variant="primary" className="w-full">
          Send message
        </Button>
        <div className="text-center text-[12px] text-muted2">or write to hello@ahvi.com</div>
      </form>
    </BlueprintFrame>
  );
}
