import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";

export interface NavigationProps extends HTMLAttributes<HTMLElement> {
  label?: string;
}

export const Navigation = forwardRef<HTMLElement, NavigationProps>(
  ({ className, label = "Navigation", ...props }, ref) => {
    return <nav ref={ref} aria-label={label} className={cn(className)} {...props} />;
  }
);

Navigation.displayName = "Navigation";
