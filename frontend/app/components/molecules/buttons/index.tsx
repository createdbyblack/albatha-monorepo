import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";
import { buttonGroupAlignClasses, buttonGroupOrientationClasses } from "../../../lib/page-builder-theme";
import { sanitizeAllowedDomProp } from "@/app/lib/sanitize-dom-prop";

export interface ButtonsProps extends HTMLAttributes<HTMLDivElement> {
  align?: "left" | "center" | "right";
  orientation?: "horizontal" | "vertical";
  unstyled?: boolean;
}

export const Buttons = forwardRef<HTMLDivElement, ButtonsProps>(
  ({ className, align = "left", orientation = "horizontal", unstyled = false, ...props }, ref) => {
    const safeAlign = sanitizeAllowedDomProp(align, ["left", "center", "right"] as const, "left");
    const safeOrientation = sanitizeAllowedDomProp(orientation, ["horizontal", "vertical"] as const, "horizontal");

    return (
      <div
        ref={ref}
        className={cn(
          unstyled ? undefined : "flex w-full gap-gutenberg-gap-sm",
          unstyled ? undefined : buttonGroupAlignClasses[safeAlign],
          unstyled ? undefined : buttonGroupOrientationClasses[safeOrientation],
          className
        )}
        {...props}
      />
    );
  }
);

Buttons.displayName = "Buttons";
