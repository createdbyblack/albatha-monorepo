import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";

export interface ButtonsProps extends HTMLAttributes<HTMLDivElement> {
  unstyled?: boolean;
}

export const Buttons = forwardRef<HTMLDivElement, ButtonsProps>(({ className, unstyled = false, ...props }, ref) => {
  return <div ref={ref} className={cn(unstyled ? undefined : "inline-flex gap-2", className)} {...props} />;
});

Buttons.displayName = "Buttons";
