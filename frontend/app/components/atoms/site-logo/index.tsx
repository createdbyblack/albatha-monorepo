import { forwardRef, type AnchorHTMLAttributes, type ImgHTMLAttributes } from "react";
import { cn } from "../../../lib/cn";

export interface SiteLogoProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src: string;
  href?: string;
  anchorProps?: AnchorHTMLAttributes<HTMLAnchorElement>;
  unstyled?: boolean;
}

export const SiteLogo = forwardRef<HTMLImageElement, SiteLogoProps>(
  ({ className, src, href, anchorProps, alt = "Site logo", unstyled = false, ...props }, ref) => {
    const logo = <img ref={ref} src={src} alt={alt} className={cn(unstyled ? undefined : "block", className)} {...props} />;

    if (!href) {
      return logo;
    }

    return (
      <a href={href} {...anchorProps}>
        {logo}
      </a>
    );
  }
);

SiteLogo.displayName = "SiteLogo";
