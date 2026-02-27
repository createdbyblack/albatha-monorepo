import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";

export interface CoverMedia {
  mediaType?: "image" | "video" | null;
  url?: string | null;
}

export interface CoverProps extends HTMLAttributes<HTMLDivElement> {
  imageUrl?: string;
  backgroundMedia?: CoverMedia | null;
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
      unstyled = false,
      ...props
    },
    ref
  ) => {
    const media = backgroundMedia?.url
      ? backgroundMedia
      : imageUrl
        ? { mediaType: "image" as const, url: imageUrl }
        : null;

    return (
      <div ref={ref} className={cn(unstyled ? undefined : "relative overflow-hidden rounded-lg border", className)} {...props}>
        {media?.url && media.mediaType === "video" ? (
          <video
            src={media.url}
            autoPlay
            muted
            loop
            playsInline
            className={cn(unstyled ? undefined : "block w-full object-cover", mediaClassName)}
          />
        ) : media?.url ? (
          <img src={media.url} alt="" aria-hidden className={cn(unstyled ? undefined : "block w-full object-cover", mediaClassName)} />
        ) : null}
        <div className={cn(unstyled ? undefined : "absolute inset-0 bg-black/30", overlayClassName)} aria-hidden />
        <div className={cn(unstyled ? undefined : "relative p-6", contentClassName)}>{children}</div>
      </div>
    );
  }
);

Cover.displayName = "Cover";
