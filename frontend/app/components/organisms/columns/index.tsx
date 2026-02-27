import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";

export interface ColumnsProps extends HTMLAttributes<HTMLDivElement> {
  unstyled?: boolean;
}

export const Columns = forwardRef<HTMLDivElement, ColumnsProps>(({ className, unstyled = false, ...props }, ref) => {
  return <div ref={ref} className={cn(unstyled ? undefined : "grid grid-cols-12 gap-4", className)} {...props} />;
});

Columns.displayName = "Columns";
