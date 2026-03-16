import { createElement, forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";
import { groupAlignClasses, groupLayoutClasses } from "../../../lib/page-builder-theme";

export interface GroupProps extends HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "article" | "aside" | "header" | "footer" | "main";
  layout?: "default" | "constrained" | "flex" | "grid";
  align?: "left" | "center" | "right" | "wide" | "full";
}

export const Group = forwardRef<HTMLDivElement, GroupProps>(
  ({ as = "div", className, layout = "default", align = "left", ...props }, ref) => {
    return createElement(as, {
      ...props,
      ref,
      className: cn(groupLayoutClasses[layout], groupAlignClasses[align], className),
    });
  }
);

Group.displayName = "Group";
