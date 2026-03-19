import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";
import { paragraphFontSizeClasses, textAlignClasses } from "../../../lib/page-builder-theme";
import { sanitizeAllowedDomProp } from "@/app/lib/sanitize-dom-prop";

export interface ParagraphProps extends HTMLAttributes<HTMLParagraphElement> {
  html?: string;
  dropCap?: boolean;
  textAlign?: "left" | "center" | "right";
  fontSize?: "sm" | "md" | "lg" | "xl";
  unstyled?: boolean;
}

export const Paragraph = forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className, html, dropCap = false, textAlign = "left", fontSize = "md", unstyled = false, children, ...props }, ref) => {
    const safeTextAlign = sanitizeAllowedDomProp(textAlign, ["left", "center", "right"] as const, "left");
    const safeFontSize = sanitizeAllowedDomProp(fontSize, ["sm", "md", "lg", "xl"] as const, "md");

    return (
      <p
        ref={ref}
        className={cn(
          unstyled ? undefined : "leading-relaxed",
          unstyled ? undefined : textAlignClasses[safeTextAlign],
          unstyled ? undefined : paragraphFontSizeClasses[safeFontSize],
          unstyled ? undefined : dropCap ? "paragraph-drop-cap" : undefined,
          className
        )}
        dangerouslySetInnerHTML={html != null ? { __html: html } : undefined}
        {...props}
      >
        {html == null ? children : null}
      </p>
    );
  }
);

Paragraph.displayName = "Paragraph";
