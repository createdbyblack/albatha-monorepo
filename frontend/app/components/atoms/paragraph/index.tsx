import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";

export interface ParagraphProps extends HTMLAttributes<HTMLParagraphElement> {
  unstyled?: boolean;
}

export const Paragraph = forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className, unstyled = false, ...props }, ref) => {
    return <p ref={ref} className={cn(unstyled ? undefined : "leading-relaxed", className)} {...props} />;
  }
);

Paragraph.displayName = "Paragraph";
