import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";
import { buttonGroupAlignClasses, buttonGroupOrientationClasses } from "../../../lib/page-builder-theme";

export interface ButtonsProps extends HTMLAttributes<HTMLDivElement> {
  align?: "left" | "center" | "right";
  orientation?: "horizontal" | "vertical";
  unstyled?: boolean;
}

export const Buttons = forwardRef<HTMLDivElement, ButtonsProps>(
  ({ className, align = "left", orientation = "horizontal", unstyled = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          unstyled ? undefined : "flex w-full gap-gutenberg-gap-sm",
          unstyled ? undefined : buttonGroupAlignClasses[align],
          unstyled ? undefined : buttonGroupOrientationClasses[orientation],
          className
        )}
        {...props}
      />
    );
  }
);

Buttons.displayName = "Buttons";
