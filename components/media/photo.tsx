import Image from "next/image";
import { cn } from "@/lib/utils";

interface PhotoProps {
  src: string;
  alt: string;
  ratio?: string;
  fit?: "cover" | "contain";
  position?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  unoptimized?: boolean;
}

export function Photo({ src, alt, ratio, fit = "cover", position = "center", className, sizes = "100vw", priority, unoptimized }: PhotoProps) {
  return (
    <div className={cn("relative overflow-hidden bg-surface", className)} style={ratio ? { aspectRatio: ratio } : undefined}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} unoptimized={unoptimized} style={{ objectFit: fit, objectPosition: position }} />
    </div>
  );
}
