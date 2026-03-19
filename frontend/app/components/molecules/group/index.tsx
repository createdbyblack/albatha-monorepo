import { createElement, forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";
import { groupAlignClasses, groupLayoutClasses } from "../../../lib/page-builder-theme";
import { sanitizeAllowedDomProp } from "@/app/lib/sanitize-dom-prop";

export interface GroupProps extends HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "article" | "aside" | "header" | "footer" | "main";
  layout?: "default" | "constrained" | "flex" | "grid";
  align?: "left" | "center" | "right" | "wide" | "full";
}

export const Group = forwardRef<HTMLDivElement, GroupProps>(
  ({ as = "div", className, layout = "default", align = "left", ...props }, ref) => {
    const safeTagName = sanitizeAllowedDomProp(as, ["div", "section", "article", "aside", "header", "footer", "main"] as const, "div");
    const safeLayout = sanitizeAllowedDomProp(layout, ["default", "constrained", "flex", "grid"] as const, "default");
    const safeAlign = sanitizeAllowedDomProp(align, ["left", "center", "right", "wide", "full"] as const, "left");

    return createElement(safeTagName, {
      ...props,
      ref,
      className: cn(groupLayoutClasses[safeLayout], groupAlignClasses[safeAlign], className),
    });
  }
);

Group.displayName = "Group";
