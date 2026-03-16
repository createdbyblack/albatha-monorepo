import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";
import { columnVerticalAlignmentClasses, getColumnWidthClasses } from "../../../lib/page-builder-theme";

export interface ColumnProps extends HTMLAttributes<HTMLDivElement> {
  width?: "auto" | "1/2" | "1/3" | "1/4" | "2/3" | "3/4";
  verticalAlignment?: "top" | "center" | "bottom";
  stackedOnMobile?: boolean;
  unstyled?: boolean;
}

export const Column = forwardRef<HTMLDivElement, ColumnProps>(
  ({ className, width = "auto", verticalAlignment = "top", stackedOnMobile = true, unstyled = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          unstyled ? undefined : "min-w-0",
          unstyled ? undefined : getColumnWidthClasses(width, stackedOnMobile),
          unstyled ? undefined : columnVerticalAlignmentClasses[verticalAlignment],
          className
        )}
        {...props}
      />
    );
  }
);

Column.displayName = "Column";
