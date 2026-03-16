import { forwardRef, type VideoHTMLAttributes } from "react";
import { cn } from "../../../lib/cn";

export interface VideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  caption?: string;
  unstyled?: boolean;
}

export const Video = forwardRef<HTMLVideoElement, VideoProps>(
  ({ className, controls = true, caption, unstyled = false, ...props }, ref) => {
    return (
      <figure className={cn(unstyled ? undefined : "space-y-2")}>
        <video ref={ref} controls={controls} className={cn(unstyled ? undefined : "block w-full rounded-lg", className)} {...props} />
        {caption ? <figcaption className="text-sm text-muted-foreground">{caption}</figcaption> : null}
      </figure>
    );
  }
);

Video.displayName = "Video";
