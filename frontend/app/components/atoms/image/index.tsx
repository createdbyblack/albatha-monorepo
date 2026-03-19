import { forwardRef, type ImgHTMLAttributes } from "react";
import { cn } from "../../../lib/cn";
import { imageAspectRatioClasses, imageScaleClasses } from "../../../lib/page-builder-theme";
import { sanitizeAllowedDomProp } from "@/app/lib/sanitize-dom-prop";

export interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "children"> {
  caption?: string;
  href?: string;
  linkTarget?: "_self" | "_blank";
  aspectRatio?: "auto" | "1/1" | "4/3" | "16/9" | "3/4" | "9/16";
  scale?: "cover" | "contain";
  unstyled?: boolean;
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      className,
      alt = "",
      caption,
      href,
      linkTarget = "_self",
      aspectRatio = "auto",
      scale = "cover",
      unstyled = false,
      src,
      ...props
    },
    ref
  ) => {
    const safeAspectRatio = sanitizeAllowedDomProp(
      aspectRatio,
      ["auto", "1/1", "4/3", "16/9", "3/4", "9/16"] as const,
      "auto"
    );
    const safeScale = sanitizeAllowedDomProp(scale, ["cover", "contain"] as const, "cover");

    const image = (
      <img
        ref={ref}
        alt={alt}
        src={src}
        className={cn(
          unstyled ? undefined : "block h-full w-full",
          unstyled ? undefined : imageScaleClasses[safeScale],
          className
        )}
        {...props}
      />
    );

    const media = href ? (
      <a href={href} target={linkTarget} rel={linkTarget === "_blank" ? "noopener noreferrer" : undefined}>
        {image}
      </a>
    ) : (
      image
    );

    return (
      <figure className={cn(unstyled ? undefined : "space-y-2")}>
        <div className={cn(unstyled ? undefined : "overflow-hidden rounded-lg", unstyled ? undefined : imageAspectRatioClasses[safeAspectRatio])}>
          {media}
        </div>
        {caption ? <figcaption className="text-sm text-muted-foreground">{caption}</figcaption> : null}
      </figure>
    );
  }
);

Image.displayName = "Image";
