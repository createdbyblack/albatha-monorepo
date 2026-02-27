import { createElement, forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel;
  unstyled?: boolean;
}

const levelClasses: Record<HeadingLevel, string> = {
  h1: "text-4xl font-bold",
  h2: "text-3xl font-semibold",
  h3: "text-2xl font-semibold",
  h4: "text-xl font-semibold",
  h5: "text-lg font-semibold",
  h6: "text-base font-semibold"
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as = "h2", className, unstyled = false, ...props }, ref) => {
    return createElement(as, {
      ...props,
      ref,
      className: cn(unstyled ? undefined : levelClasses[as], className)
    });
  }
);

Heading.displayName = "Heading";
