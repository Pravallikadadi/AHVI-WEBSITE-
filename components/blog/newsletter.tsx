"use client";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section className="bg-surface">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-6 px-5 py-14 sm:px-8 sm:py-16">
        <div>
          <div className="mb-3 text-[11px] tracking-[0.24em] text-muted">Stay inspired</div>
          <div className="mb-2 font-condensed text-[clamp(24px,3vw,32px)] font-semibold">Get fresh style ideas in your inbox</div>
          <p className="text-[14px] text-muted">Subscribe to our newsletter and never miss a story.</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!email) return;
            setDone(true);
          }}
          className="flex w-full max-w-[420px] flex-col gap-2 sm:flex-row"
        >
          {done ? (
            <div className="flex-1 py-3.5 text-center text-[14px] text-accent">Thanks — you're subscribed.</div>
          ) : (
            <>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                placeholder="Enter your email"
                className="min-w-0 flex-1 border border-ink/15 bg-bg px-5 py-3.5 text-[14px] placeholder:text-muted"
              />
              <button type="submit" className="flex shrink-0 items-center justify-center gap-2 whitespace-nowrap border border-ink bg-ink px-5 py-3.5 text-[13px] tracking-[0.06em] text-bg hover:bg-black">
                Subscribe <ArrowRight size={14} />
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
