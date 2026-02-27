import { forwardRef, type VideoHTMLAttributes } from "react";
import { cn } from "../../../lib/cn";

export interface VideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  unstyled?: boolean;
}

export const Video = forwardRef<HTMLVideoElement, VideoProps>(
  ({ className, controls = true, unstyled = false, ...props }, ref) => {
    return <video ref={ref} controls={controls} className={cn(unstyled ? undefined : "block", className)} {...props} />;
  }
);

Video.displayName = "Video";
