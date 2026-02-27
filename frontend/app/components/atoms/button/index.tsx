import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../../lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  unstyled?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "rounded-md border px-4 py-2 font-medium",
  secondary: "rounded-md border px-4 py-2 font-medium opacity-90",
  ghost: "rounded-md px-4 py-2 font-medium"
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base"
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", unstyled = false, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(unstyled ? undefined : variantClasses[variant], unstyled ? undefined : sizeClasses[size], className)}
        data-variant={variant}
        data-size={size}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
