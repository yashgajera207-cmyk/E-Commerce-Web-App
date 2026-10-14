import { type InputHTMLAttributes, type ElementType, type ReactNode, type FocusEvent, forwardRef, useState } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  floatingLabel?: boolean;
  error?: string | null;
  helperText?: string;
  icon?: ElementType;
  endAdornment?: ReactNode;
  containerClassName?: string;
}

/**
 * Reusable Input component supporting floating labels, prefix icons, and error states.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      floatingLabel = false,
      error,
      helperText,
      icon: Icon,
      endAdornment,
      className = "",
      containerClassName = "",
      value,
      onFocus,
      onBlur,
      required,
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const hasValue = value !== undefined && value !== null && String(value).length > 0;

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if (onFocus) onFocus(e);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (onBlur) onBlur(e);
    };

    // FLOATING LABEL VARIANT (ShopZone / Flipkart signature design)
    if (floatingLabel && label) {
      const isFloating = isFocused || hasValue;

      return (
        <div className={`relative pt-3 ${containerClassName}`}>
          <input
            ref={ref}
            id={inputId}
            value={value}
            required={required}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`w-full text-sm text-gray-900 border-b pb-2 outline-none bg-transparent transition-colors ${
              error
                ? "border-red-500 focus:border-red-600"
                : "border-gray-300 focus:border-[#2874f0]"
            } ${endAdornment ? "pr-8" : ""} ${className}`}
            {...rest}
          />

          <label
            htmlFor={inputId}
            className={`absolute left-0 text-sm transition-all duration-200 pointer-events-none select-none ${
              isFloating
                ? error
                  ? "top-0 text-xs text-red-600 font-medium"
                  : "top-0 text-xs text-[#2874f0] font-medium"
                : "top-3 text-gray-500"
            }`}
          >
            {label} {required && "*"}
          </label>

          {endAdornment && (
            <div className="absolute right-0 bottom-2 flex items-center">{endAdornment}</div>
          )}

          {error && <p className="text-[11px] text-red-600 mt-1 font-medium">{error}</p>}
          {!error && helperText && <p className="text-[11px] text-gray-500 mt-1">{helperText}</p>}
        </div>
      );
    }

    // STANDARD INPUT VARIANT
    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-gray-700 mb-1.5">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {Icon && (
            <div className="absolute left-3 text-gray-400 pointer-events-none">
              <Icon className="w-4 h-4" />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            value={value}
            required={required}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`w-full text-sm text-gray-900 bg-gray-50 border rounded-sm py-2 outline-none transition-all focus:bg-white ${
              Icon ? "pl-9" : "pl-3"
            } ${endAdornment ? "pr-9" : "pr-3"} ${
              error
                ? "border-red-400 focus:border-red-600 focus:ring-1 focus:ring-red-500/20"
                : "border-gray-200 focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]/20"
            } ${className}`}
            {...rest}
          />

          {endAdornment && (
            <div className="absolute right-2.5 flex items-center">{endAdornment}</div>
          )}
        </div>

        {error && <p className="text-[11px] text-red-600 mt-1 font-medium">{error}</p>}
        {!error && helperText && <p className="text-[11px] text-gray-500 mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
