import { forwardRef, type AnchorHTMLAttributes, type ImgHTMLAttributes } from "react";
import { cn } from "../../../lib/cn";
import { siteLogoWidthClasses } from "../../../lib/page-builder-theme";
import { sanitizeAllowedDomProp } from "@/app/lib/sanitize-dom-prop";

export interface SiteLogoProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src?: string;
  href?: string;
  widthPreset?: "sm" | "md" | "lg";
  isLink?: boolean;
  linkTarget?: "_self" | "_blank";
  fallbackLabel?: string;
  anchorProps?: AnchorHTMLAttributes<HTMLAnchorElement>;
  unstyled?: boolean;
}

export const SiteLogo = forwardRef<HTMLImageElement, SiteLogoProps>(
  ({ className, src, href, widthPreset = "md", isLink = true, linkTarget = "_self", fallbackLabel, anchorProps, alt = "Site logo", unstyled = false, ...props }, ref) => {
    const safeWidthPreset = sanitizeAllowedDomProp(widthPreset, ["sm", "md", "lg"] as const, "md");

    const logo = src ? (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn(unstyled ? undefined : "block h-auto", unstyled ? undefined : siteLogoWidthClasses[safeWidthPreset], className)}
        {...props}
      />
    ) : fallbackLabel ? (
      <span className={cn(unstyled ? undefined : "inline-flex text-lg font-semibold", className)}>{fallbackLabel}</span>
    ) : null;

    if (!logo || !isLink || !href) {
      return logo;
    }

    return (
      <a href={href} target={linkTarget} rel={linkTarget === "_blank" ? "noopener noreferrer" : undefined} {...anchorProps}>
        {logo}
      </a>
    );
  }
);

SiteLogo.displayName = "SiteLogo";
