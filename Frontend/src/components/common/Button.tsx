import { type ButtonHTMLAttributes, type ElementType, forwardRef } from "react";
import type { ButtonSize, ButtonVariant } from "../../types";
import Spinner from "./Spinner";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-[#fb641b] hover:bg-[#e25410] active:bg-[#c94508] text-white shadow-xs",
  secondary: "bg-[#ffe500] hover:bg-[#ebd300] active:bg-[#d6c000] text-[#212121] shadow-xs",
  blue: "bg-[#2874f0] hover:bg-[#1260e0] active:bg-[#0b4fb8] text-white shadow-xs",
  outline: "bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 active:bg-gray-100",
  ghost: "bg-transparent text-[#2874f0] hover:bg-blue-50 active:bg-blue-100",
  danger: "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-xs",
};

const sizes: Record<ButtonSize, string> = {
  sm: "text-xs px-3 py-1.5 rounded-sm font-medium",
  md: "text-sm px-4 py-2.5 rounded-sm font-semibold",
  lg: "text-base px-6 py-3 rounded-sm font-bold",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Optional leading icon component, e.g. from lucide-react. */
  icon?: ElementType;
  /** Optional trailing icon component */
  rightIcon?: ElementType;
  /** If true, displays a loading spinner and disables click actions */
  isLoading?: boolean;
  /** Text to show while loading */
  loadingText?: string;
  /** Expand button across the entire container width */
  fullWidth?: boolean;
}

/**
 * Reusable Button component with comprehensive style variants, sizes, and states.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      className = "",
      icon: Icon,
      rightIcon: RightIcon,
      isLoading = false,
      loadingText,
      fullWidth = false,
      disabled,
      ...rest
    },
    ref
  ) => {
    const spinnerColor =
      variant === "outline" || variant === "ghost" ? "blue" : variant === "secondary" ? "gray" : "white";

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none ${
          fullWidth ? "w-full" : ""
        } ${variants[variant]} ${sizes[size]} ${className}`}
        {...rest}
      >
        {isLoading ? (
          <>
            <Spinner size={size === "lg" ? "md" : "sm"} color={spinnerColor} />
            {loadingText || children}
          </>
        ) : (
          <>
            {Icon && <Icon className={size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-5 h-5" : "w-4 h-4"} />}
            {children}
            {RightIcon && (
              <RightIcon className={size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-5 h-5" : "w-4 h-4"} />
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
