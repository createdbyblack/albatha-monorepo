import { forwardRef, type LiHTMLAttributes } from "react";
import { cn } from "../../../lib/cn";

export interface ListItemProps extends LiHTMLAttributes<HTMLLIElement> {
  html?: string;
}

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(({ className, html, children, ...props }, ref) => {
  return (
    <li
      ref={ref}
      className={cn(className)}
      dangerouslySetInnerHTML={html != null ? { __html: html } : undefined}
      {...props}
    >
      {html == null ? children : null}
    </li>
  );
});

ListItem.displayName = "ListItem";
