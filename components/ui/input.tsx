import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full border border-ink/15 bg-bg px-4 py-3 text-[15px] text-ink placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
