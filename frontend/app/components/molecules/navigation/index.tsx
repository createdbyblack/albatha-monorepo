'use client'

import { forwardRef, useId, useState, type HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";
import { navigationLayoutClasses } from "../../../lib/page-builder-theme";
import { sanitizeAllowedDomProp } from "@/app/lib/sanitize-dom-prop";

export interface NavigationProps extends HTMLAttributes<HTMLElement> {
  label?: string;
  overlayMenu?: "never" | "mobile" | "always";
  icon?: "menu" | "dots";
  layout?: "horizontal" | "vertical";
}

export const Navigation = forwardRef<HTMLElement, NavigationProps>(
  ({ className, label = "Navigation", overlayMenu = "never", icon = "menu", layout = "horizontal", children, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const contentId = useId();
    const safeOverlayMenu = sanitizeAllowedDomProp(overlayMenu, ["never", "mobile", "always"] as const, "never");
    const safeIcon = sanitizeAllowedDomProp(icon, ["menu", "dots"] as const, "menu");
    const safeLayout = sanitizeAllowedDomProp(layout, ["horizontal", "vertical"] as const, "horizontal");
    const usesOverlay = safeOverlayMenu !== "never";

    return (
      <nav ref={ref} aria-label={label} className={cn("relative", className)} {...props}>
        {usesOverlay ? (
          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls={contentId}
            className={cn(
              "inline-flex items-center justify-center rounded-full border border-border bg-background p-3 text-foreground transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              safeOverlayMenu === "mobile" ? "md:hidden" : undefined
            )}
            onClick={() => setIsOpen((open) => !open)}
          >
            <span className="sr-only">Toggle navigation</span>
            {safeIcon === "dots" ? <span className="text-lg leading-none">...</span> : <span className="text-lg leading-none">=</span>}
          </button>
        ) : null}
        <div
          id={contentId}
          className={cn(
            "w-full",
            navigationLayoutClasses[safeLayout],
            safeOverlayMenu === "never"
              ? "flex"
              : safeOverlayMenu === "mobile"
                ? isOpen
                  ? "mt-4 flex md:mt-0 md:flex"
                  : "hidden md:flex"
                : isOpen
                  ? "mt-4 flex"
                  : "hidden"
          )}
        >
          {children}
        </div>
      </nav>
    );
  }
);

Navigation.displayName = "Navigation";
