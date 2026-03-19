import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../../lib/cn";
import { buttonSizeClasses, buttonVariantClasses } from "../../../lib/page-builder-theme";
import { sanitizeAllowedDomProp } from "@/app/lib/sanitize-dom-prop";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  unstyled?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", unstyled = false, ...props }, ref) => {
    const safeVariant = sanitizeAllowedDomProp(variant, ["primary", "secondary", "ghost"] as const, "primary");
    const safeSize = sanitizeAllowedDomProp(size, ["sm", "md", "lg"] as const, "md");

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          unstyled ? undefined : "inline-flex items-center justify-center rounded-full border font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          unstyled ? undefined : buttonVariantClasses[safeVariant],
          unstyled ? undefined : buttonSizeClasses[safeSize],
          className
        )}
        data-variant={safeVariant}
        data-size={safeSize}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
