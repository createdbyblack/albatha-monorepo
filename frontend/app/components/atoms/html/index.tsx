import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";

export interface HtmlProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  html: string;
  unstyled?: boolean;
}

export const Html = forwardRef<HTMLDivElement, HtmlProps>(({ className, html, unstyled = false, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(unstyled ? undefined : "prose", className)}
      dangerouslySetInnerHTML={{ __html: html }}
      {...props}
    />
  );
});

Html.displayName = "Html";
