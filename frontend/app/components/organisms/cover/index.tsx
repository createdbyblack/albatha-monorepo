import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";
import { coverMinHeightClasses, coverPositionClasses, resolveOverlayStyle } from "../../../lib/page-builder-theme";
import { sanitizeAllowedDomProp } from "@/app/lib/sanitize-dom-prop";

export interface CoverMedia {
  mediaType?: "image" | "video" | null;
  url?: string | null;
}

export interface CoverProps extends HTMLAttributes<HTMLDivElement> {
  imageUrl?: string;
  backgroundMedia?: CoverMedia | null;
  alt?: string;
  dimRatio?: number;
  overlayColor?: string;
  contentPosition?: keyof typeof coverPositionClasses;
  minHeight?: keyof typeof coverMinHeightClasses;
  hasParallax?: boolean;
  mediaClassName?: string;
  overlayClassName?: string;
  contentClassName?: string;
  unstyled?: boolean;
}

export const Cover = forwardRef<HTMLDivElement, CoverProps>(
  (
    {
      className,
      imageUrl,
      backgroundMedia,
      children,
      mediaClassName,
      overlayClassName,
      contentClassName,
      alt,
      dimRatio = 50,
      overlayColor = "#000000",
      contentPosition = "center-center",
      minHeight = "md",
      hasParallax = false,
      unstyled = false,
      ...props
    },
    ref
  ) => {
    const safeContentPosition = sanitizeAllowedDomProp(
      contentPosition,
      [
        "top-left",
        "top-center",
        "top-right",
        "center-left",
        "center-center",
        "center-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ] as const,
      "center-center"
    );
    const safeMinHeight = sanitizeAllowedDomProp(minHeight, ["sm", "md", "lg", "full"] as const, "md");

    const media = backgroundMedia?.url
      ? backgroundMedia
      : imageUrl
        ? { mediaType: "image" as const, url: imageUrl }
        : null;

    return (
      <div
        ref={ref}
        aria-label={alt || undefined}
        className={cn(
          unstyled ? undefined : "relative overflow-hidden rounded-xl border border-border",
          unstyled ? undefined : coverMinHeightClasses[safeMinHeight],
          className
        )}
        {...props}
      >
        {media?.url && media.mediaType === "video" ? (
          <video
            src={media.url}
            autoPlay
            muted
            loop
            playsInline
            className={cn(unstyled ? undefined : "absolute inset-0 h-full w-full object-cover", mediaClassName)}
          />
        ) : media?.url ? (
          hasParallax ? (
            <div
              aria-hidden
              className={cn(
                unstyled ? undefined : "absolute inset-0 bg-cover bg-center bg-fixed",
                mediaClassName
              )}
              style={{ backgroundImage: `url(${media.url})` }}
            />
          ) : (
            <img
              src={media.url}
              alt=""
              aria-hidden
              className={cn(unstyled ? undefined : "absolute inset-0 h-full w-full object-cover", mediaClassName)}
            />
          )
        ) : null}
        <div
          className={cn(unstyled ? undefined : "absolute inset-0", overlayClassName)}
          style={resolveOverlayStyle(overlayColor, dimRatio)}
          aria-hidden
        />
        <div
          className={cn(
            unstyled ? undefined : "relative z-10 flex h-full p-6 md:p-8",
            unstyled ? undefined : coverPositionClasses[safeContentPosition],
            contentClassName
          )}
        >
          {children}
        </div>
      </div>
    );
  }
);

Cover.displayName = "Cover";
