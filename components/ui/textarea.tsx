import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full border border-ink/15 bg-bg px-4 py-3 text-[15px] text-ink placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
