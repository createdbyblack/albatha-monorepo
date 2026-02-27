import type { HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";

export type ListKind = "ordered" | "unordered";

export interface ListProps extends HTMLAttributes<HTMLOListElement | HTMLUListElement> {
  kind?: ListKind;
  unstyled?: boolean;
}

export function List({ className, kind = "unordered", unstyled = false, ...props }: ListProps) {
  const classes = cn(
    unstyled ? undefined : "pl-6",
    unstyled ? undefined : kind === "ordered" ? "list-decimal" : "list-disc",
    className
  );

  if (kind === "ordered") {
    return <ol className={classes} {...(props as HTMLAttributes<HTMLOListElement>)} />;
  }

  return <ul className={classes} {...(props as HTMLAttributes<HTMLUListElement>)} />;
}
