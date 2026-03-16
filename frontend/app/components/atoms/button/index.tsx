import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../../lib/cn";
import { buttonSizeClasses, buttonVariantClasses } from "../../../lib/page-builder-theme";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  unstyled?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", unstyled = false, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          unstyled ? undefined : "inline-flex items-center justify-center rounded-full border font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          unstyled ? undefined : buttonVariantClasses[variant],
          unstyled ? undefined : buttonSizeClasses[size],
          className
        )}
        data-variant={variant}
        data-size={size}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
