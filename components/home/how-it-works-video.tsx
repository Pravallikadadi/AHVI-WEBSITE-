"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function HowItWorksVideo({
  src,
  label,
  exists,
  onEnded,
  className,
}: {
  src: string;
  label: string;
  exists: boolean;
  onEnded?: () => void;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [blocked, setBlocked] = useState(false);

  // No `autoPlay` attribute — playback is driven entirely by visibility so a video never starts
  // before the user actually scrolls to it. Starts once at least half the video is on screen,
  // pauses (without resetting position) the moment it drops back below that, and only fires on
  // real enter/exit crossings of the 50% threshold, not on every scroll pixel.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          el.play().catch(() => setBlocked(true));
        } else {
          el.pause();
        }
      },
      { threshold: [0.5] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [src]);

  return (
    <div
      className={cn(
        // Mobile (default): full-width 4:5 box, unchanged.
        // Desktop (lg+): the source videos are tall phone-screen recordings (~0.49 width/height),
        // not 4:5 — sizing the box to their real ratio at a fixed, content-matched height (instead
        // of stretching a 4:5 box across the full sticky column width) removes the large forced
        // height that pushed the section well past the content cards.
        "relative mx-auto aspect-[4/5] w-full shrink-0 overflow-hidden rounded-2xl bg-bg lg:aspect-[1080/2200] lg:h-[520px] lg:w-auto",
        className
      )}
    >
      {exists ? (
        <video
          ref={videoRef}
          key={src}
          src={src}
          muted
          playsInline
          controls={blocked}
          onEnded={onEnded}
          className="h-full w-full object-contain"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 px-4 text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted2">Video Clip Placeholder</span>
          <span className="text-[12px] text-muted">{label}</span>
        </div>
      )}
    </div>
  );
}
