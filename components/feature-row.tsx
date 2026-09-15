"use client";
import { motion } from "framer-motion";
import { Photo } from "@/components/media/photo";
import { ImageReveal } from "@/components/motion/image-reveal";
import { TextReveal } from "@/components/motion/text-reveal";

export function FeatureRow({
  n,
  name,
  note,
  img,
  alt,
  reverse,
}: {
  n: string;
  name: string;
  note: string;
  img: string;
  alt: string;
  reverse?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6 }}
      className="grid items-center gap-10 border-t border-ink/10 py-12 sm:py-16 lg:grid-cols-2 lg:gap-14"
    >
      <div className={reverse ? "lg:order-2" : ""}>
        <ImageReveal>
          <Photo src={img} alt={alt} ratio="4/5" className="bg-surface" />
        </ImageReveal>
      </div>
      <div>
        <div className="mb-2.5 font-condensed text-[14px] text-muted2">{n}</div>
        <div className="mb-3.5 font-condensed text-[clamp(28px,3.4vw,42px)] font-semibold leading-tight"><TextReveal text={name} /></div>
        <p className="max-w-[40ch] text-[16px] leading-relaxed text-muted">{note}</p>
      </div>
    </motion.div>
  );
}
