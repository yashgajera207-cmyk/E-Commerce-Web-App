import type { ButtonHTMLAttributes, ElementType } from "react";
import type { ButtonSize, ButtonVariant } from "../../types";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand-orange hover:bg-brand-orange-dark text-white shadow-sm shadow-orange-900/10",
  secondary: "bg-brand-yellow hover:brightness-95 text-brand-navy",
  outline: "bg-white border border-gray-300 text-gray-800 hover:bg-gray-50",
  ghost: "bg-transparent text-brand-blue hover:bg-blue-50",
};

const sizes: Record<ButtonSize, string> = {
  sm: "text-xs px-3 py-1.5 rounded-md",
  md: "text-sm px-4 py-2.5 rounded-lg",
  lg: "text-base px-6 py-3 rounded-lg",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Optional leading icon component, e.g. from lucide-react. */
  icon?: ElementType;
}

/**
 * Common button used across the storefront.
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  icon: Icon,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}
