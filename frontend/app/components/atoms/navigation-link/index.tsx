import { forwardRef, type AnchorHTMLAttributes } from "react";
import { cn } from "../../../lib/cn";

export interface NavigationLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  unstyled?: boolean;
}

export const NavigationLink = forwardRef<HTMLAnchorElement, NavigationLinkProps>(
  ({ className, unstyled = false, ...props }, ref) => {
    return <a ref={ref} className={cn(unstyled ? undefined : "underline-offset-4 hover:underline", className)} {...props} />;
  }
);

NavigationLink.displayName = "NavigationLink";
