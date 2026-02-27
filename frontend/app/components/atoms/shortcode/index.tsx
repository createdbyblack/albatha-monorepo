import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";

export interface ShortcodeProps extends HTMLAttributes<HTMLElement> {
  value: string;
  unstyled?: boolean;
}

export const Shortcode = forwardRef<HTMLElement, ShortcodeProps>(
  ({ className, value, unstyled = false, ...props }, ref) => {
    return (
      <code ref={ref} className={cn(unstyled ? undefined : "rounded border px-2 py-1 text-sm", className)} {...props}>
        {value}
      </code>
    );
  }
);

Shortcode.displayName = "Shortcode";
