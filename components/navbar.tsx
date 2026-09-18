"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";

import { AhviLogo } from "@/components/ahvi-logo";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { navLinks, mobileMenuLinks } from "@/lib/site-data";

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const reduce = useReducedMotion();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 12);
    if (open) return;
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(latest > prev && latest > 140);
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: reduce ? 0.01 : 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={
          "fixed inset-x-0 top-0 z-50 border-b bg-bg/95 backdrop-blur-md transition-[border-color,box-shadow] duration-300 " +
          (scrolled ? "border-ink/10 shadow-[0_1px_0_rgba(0,0,0,0.03)]" : "border-transparent")
        }
      >
        <motion.div
          aria-hidden
          className="absolute inset-x-0 bottom-[-1px] h-px origin-left bg-ink/60"
          style={{ scaleX: scrollYProgress }}
        />
        <div className="mx-auto flex max-w-[1600px] items-center gap-8 px-5 py-3.5 sm:px-8">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="mr-auto flex items-center gap-1.5 text-[28px] tracking-[0.08em] text-ink sm:text-[32px]"
          >
            <AhviLogo size={26} />
            <span className="ahvi-wordmark">AHVI</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((l) => {
              const active = isActivePath(pathname, l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative py-1 text-[14px] leading-[18px] font-medium tracking-normal transition-colors after:absolute after:inset-x-0 after:-bottom-[1px] after:h-px after:origin-left after:bg-ink after:transition-transform hover:text-ink hover:after:scale-x-100",
                    active ? "text-ink after:scale-x-100" : "text-ink/75 after:scale-x-0"
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <MagneticButton strength={10} className="hidden lg:inline-block">
            <Link
              href="/waitlist"
              className="group inline-flex items-center gap-2.5 border border-ink bg-ink px-5 py-2.5 text-[14px] leading-[18px] font-medium tracking-normal text-bg transition-colors hover:bg-transparent hover:text-ink"
            >
              Join the Waitlist <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </MagneticButton>
          <ThemeToggle />
          <button
            aria-label="Menu"
            onClick={() => setOpen(true)}
            className="grid h-[42px] w-[42px] place-items-center border border-ink/15 text-ink transition-colors hover:bg-ink/5"
          >
            <Menu size={18} strokeWidth={1.5} />
          </button>
        </div>
      </motion.header>

      {open && (
        // Fixed dark chrome, independent of the site's light/dark theme — a full-screen nav takeover
        // should read the same regardless of which theme the visitor is browsing in.
        <div className="fixed inset-0 z-[80] flex flex-col overflow-y-auto bg-[#0A0A0A] p-6 text-white sm:p-10">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[38px] tracking-[0.1em]">
              <AhviLogo size={30} className="text-white" />
              <span className="ahvi-wordmark">AHVI</span>
            </span>
            <div className="flex items-center gap-2.5">
              <ThemeToggle className="border-white/25 text-white hover:bg-white/10" />
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="grid h-[42px] w-[42px] place-items-center border border-white/25 text-white"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>
          <div className="grid max-w-3xl flex-1 content-center gap-1 py-6">
            {mobileMenuLinks.map((l) => {
              const active = isActivePath(pathname, l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-baseline gap-4 border-b py-1.5 font-condensed text-[clamp(28px,5.4vw,56px)] font-semibold leading-[1.08] transition-colors hover:text-white",
                    active ? "border-white/40 text-white" : "border-white/10 text-white/70"
                  )}
                >
                  <span className={cn("font-sans text-[11px] tracking-[0.2em]", active ? "text-white/80" : "text-white/50")}>
                    {l.n}
                  </span>
                  {l.label}
                </Link>
              );
            })}
          </div>
          <Link
            href="/waitlist"
            onClick={() => setOpen(false)}
            className="group mb-6 inline-flex w-fit items-center gap-2.5 border border-white bg-white px-6 py-4 text-[14px] font-medium text-[#0A0A0A] transition-colors hover:bg-transparent hover:text-white"
          >
            Join the Waitlist <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <div className="flex flex-wrap gap-4 text-[12px] tracking-[0.12em] text-white/50">
            <span>hello@ahvi.com</span>
          </div>
        </div>
      )}
    </>
  );
}
