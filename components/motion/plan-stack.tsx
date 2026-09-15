"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

type StackItem = {
  src: string;
  alt: string;
  width: number;
  height: number;
  x: string;
  scale: number;
  rotate: number;
  z: number;
  blur: number;
  opacity: number;
};

// Index 2 (Today's Plan) is the dominant center card; the rest fan out behind it, smaller and dimmer with distance.
const ITEMS: StackItem[] = [
  { src: "/images/plan-diet-fitness.webp", alt: "AHVI Diet & Fitness screen", width: 340, height: 640, x: "-42%", scale: 0.64, rotate: -12, z: 10, blur: 1.5, opacity: 0.6 },
  { src: "/images/plan-home-bills.webp", alt: "AHVI Home & Utilities — Bills screen", width: 260, height: 660, x: "-24%", scale: 0.82, rotate: -6, z: 20, blur: 0.5, opacity: 0.88 },
  { src: "/images/plan-todays-plan.webp", alt: "AHVI Today's Plan screen", width: 365, height: 815, x: "0%", scale: 1, rotate: 0, z: 50, blur: 0, opacity: 1 },
  { src: "/images/plan-home-medi.webp", alt: "AHVI Home & Utilities — MediTrack screen", width: 270, height: 745, x: "24%", scale: 0.82, rotate: 6, z: 20, blur: 0.5, opacity: 0.88 },
  { src: "/images/plan-skincare.webp", alt: "AHVI Skincare screen", width: 350, height: 700, x: "42%", scale: 0.64, rotate: 12, z: 10, blur: 1.5, opacity: 0.6 },
];

const CENTER_INDEX = 2;

/** One dominant center card with the rest fanned out and layered behind it — a premium stacked reveal, not a loose float. */
export function PlanStack() {
  const reduce = useReducedMotion();

  return (
    <div className="relative h-[300px] w-full overflow-hidden sm:h-[380px] lg:h-[460px]">
      {ITEMS.map((item, i) => {
        const distance = Math.abs(i - CENTER_INDEX);
        const resting = { x: item.x, scale: item.scale, rotate: item.rotate, opacity: item.opacity, filter: `blur(${item.blur}px)` };

        return (
          <motion.div
            key={item.src}
            className="absolute inset-0 flex items-end justify-center"
            style={{ zIndex: item.z, transformOrigin: "bottom center" }}
            initial={
              reduce
                ? resting
                : { x: item.x, scale: item.scale * 0.72, rotate: item.rotate * 1.8, opacity: 0, filter: "blur(8px)" }
            }
            whileInView={resting}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: reduce ? 0.01 : 0.9, delay: reduce ? 0 : distance * 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              sizes="(min-width: 1024px) 20vw, 38vw"
              priority={i === CENTER_INDEX}
              className="h-full w-auto rounded-xl drop-shadow-[0_28px_50px_rgba(10,10,10,0.24)]"
            />
          </motion.div>
        );
      })}
    </div>
  );
}
