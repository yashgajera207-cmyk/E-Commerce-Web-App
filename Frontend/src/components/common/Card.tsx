import { type HTMLAttributes, forwardRef } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, hoverable = false, className = "", ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-white rounded-sm border border-gray-200/80 shadow-xs ${
          hoverable ? "hover:shadow-md transition-shadow duration-200" : ""
        } ${className}`}
        {...rest}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className = "", ...rest }, ref) => {
    return (
      <div ref={ref} className={`p-4 sm:p-5 border-b border-gray-100 ${className}`} {...rest}>
        {children}
      </div>
    );
  }
);
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ children, className = "", ...rest }, ref) => {
    return (
      <h3 ref={ref} className={`text-base font-bold text-gray-900 leading-snug ${className}`} {...rest}>
        {children}
      </h3>
    );
  }
);
CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ children, className = "", ...rest }, ref) => {
    return (
      <p ref={ref} className={`text-xs text-gray-500 mt-1 ${className}`} {...rest}>
        {children}
      </p>
    );
  }
);
CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className = "", ...rest }, ref) => {
    return (
      <div ref={ref} className={`p-4 sm:p-5 ${className}`} {...rest}>
        {children}
      </div>
    );
  }
);
CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className = "", ...rest }, ref) => {
    return (
      <div ref={ref} className={`p-4 sm:p-5 border-t border-gray-100 bg-gray-50/50 ${className}`} {...rest}>
        {children}
      </div>
    );
  }
);
CardFooter.displayName = "CardFooter";

export default Card;
