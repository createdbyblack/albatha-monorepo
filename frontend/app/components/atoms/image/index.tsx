import { forwardRef, type ImgHTMLAttributes } from "react";
import { cn } from "../../../lib/cn";

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  unstyled?: boolean;
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ className, alt = "", unstyled = false, ...props }, ref) => {
    return <img ref={ref} alt={alt} className={cn(unstyled ? undefined : "block", className)} {...props} />;
  }
);

Image.displayName = "Image";
