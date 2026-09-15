"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Tag } from "lucide-react";

// Placeholder client-side validation — swap for a real coupon API when one exists.
const DEMO_VALID_CODES = ["AHVI7", "WELCOME"];

export function CouponInput() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const apply = () => {
    const trimmed = code.trim();
    if (!trimmed) {
      setState("error");
      setMessage("Enter a coupon code");
      return;
    }
    setState("loading");
    setTimeout(() => {
      if (DEMO_VALID_CODES.includes(trimmed.toUpperCase())) {
        setState("success");
        setMessage("Coupon applied");
      } else {
        setState("error");
        setMessage("This coupon isn't valid");
      }
    }, 650);
  };

  if (state === "success") {
    return (
      <div className="mx-auto flex max-w-[520px] items-center justify-center gap-2 border border-accent/30 py-3.5 text-[13.5px] text-accent">
        <Check size={15} /> {message}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[520px]">
      <AnimatePresence initial={false} mode="wait">
        {!open ? (
          <motion.button
            key="closed"
            type="button"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex w-full items-center justify-between border border-dashed border-ink/20 px-5 py-3.5 text-[13.5px]"
          >
            <span className="flex items-center gap-2 text-muted">
              <Tag size={14} /> Have a coupon?
            </span>
            <span className="border border-ink/20 px-4 py-1.5 text-[11.5px] tracking-[0.08em]">Apply</span>
          </motion.button>
        ) : (
          <motion.div
            key="open"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex gap-2"
          >
            <input
              autoFocus
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (state === "error") setState("idle");
              }}
              onKeyDown={(e) => e.key === "Enter" && apply()}
              placeholder="Enter coupon code"
              aria-label="Coupon code"
              className="flex-1 border border-ink/15 bg-bg px-4 py-3 text-[13.5px] tracking-[0.04em] placeholder:normal-case placeholder:tracking-normal placeholder:text-muted"
            />
            <button
              type="button"
              onClick={apply}
              disabled={state === "loading"}
              className="flex items-center gap-1.5 border border-ink bg-ink px-5 py-3 text-[12px] tracking-[0.08em] text-bg disabled:opacity-60"
            >
              {state === "loading" && <Loader2 size={13} className="animate-spin" />} Apply
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {state === "error" && <p className="mt-2 text-center text-[12.5px] text-error">{message}</p>}
    </div>
  );
}
