import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";

export interface ColumnProps extends HTMLAttributes<HTMLDivElement> {
  unstyled?: boolean;
}

export const Column = forwardRef<HTMLDivElement, ColumnProps>(({ className, unstyled = false, ...props }, ref) => {
  return <div ref={ref} className={cn(unstyled ? undefined : "min-w-0", className)} {...props} />;
});

Column.displayName = "Column";
