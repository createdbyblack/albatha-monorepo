import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";
import { columnsGapClasses, columnsVerticalAlignmentClasses } from "../../../lib/page-builder-theme";

export interface ColumnsProps extends HTMLAttributes<HTMLDivElement> {
  gap?: "none" | "sm" | "md" | "lg";
  verticalAlignment?: "top" | "center" | "bottom";
  isStackedOnMobile?: boolean;
  unstyled?: boolean;
}

export const Columns = forwardRef<HTMLDivElement, ColumnsProps>(
  ({ className, gap = "md", verticalAlignment = "top", isStackedOnMobile = true, unstyled = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          unstyled ? undefined : "flex w-full",
          unstyled ? undefined : isStackedOnMobile ? "flex-col md:flex-row" : "flex-row flex-nowrap",
          unstyled ? undefined : columnsGapClasses[gap],
          unstyled ? undefined : columnsVerticalAlignmentClasses[verticalAlignment],
          className
        )}
        {...props}
      />
    );
  }
);

Columns.displayName = "Columns";
