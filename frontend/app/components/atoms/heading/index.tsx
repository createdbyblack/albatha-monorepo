import { createElement, forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";
import { textAlignClasses } from "../../../lib/page-builder-theme";
import { sanitizeAllowedDomProp } from "@/app/lib/sanitize-dom-prop";

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel;
  textAlign?: "left" | "center" | "right";
  unstyled?: boolean;
}

const levelClasses: Record<string, string> = {
  h1: "text-4xl font-bold",
  h2: "text-3xl font-semibold",
  h3: "text-2xl font-semibold",
  h4: "text-xl font-semibold",
  h5: "text-lg font-semibold",
  h6: "text-base font-semibold"
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as = "h2", className, textAlign = "left", unstyled = false, ...props }, ref) => {
    const safeLevel = sanitizeAllowedDomProp(as, ["h1", "h2", "h3", "h4", "h5", "h6"] as const, "h2");
    const safeTextAlign = sanitizeAllowedDomProp(textAlign, ["left", "center", "right"] as const, "left");

    return createElement(safeLevel, {
      ...props,
      ref,
      className: cn(
        unstyled ? undefined : levelClasses[safeLevel],
        unstyled ? undefined : textAlignClasses[safeTextAlign],
        className
      )
    });
  }
);

Heading.displayName = "Heading";
