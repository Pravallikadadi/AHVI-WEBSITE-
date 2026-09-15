"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-[14px] leading-[18px] font-medium tracking-normal transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-ink text-bg border border-ink hover:bg-black",
        gold: "bg-goldsoft text-ink border border-goldsoft hover:bg-ink hover:text-bg hover:border-ink",
        outline: "bg-transparent text-ink border border-ink/20 hover:bg-ink/5",
        ghost: "bg-transparent text-ink border border-transparent hover:text-accent",
      },
      size: {
        default: "px-6 py-4",
        sm: "px-4 py-2.5 text-[14px]",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
