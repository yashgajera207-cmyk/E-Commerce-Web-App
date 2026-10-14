import { type ReactNode } from "react";
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

export type AlertVariant = "error" | "success" | "warning" | "info";

interface AlertProps {
  children: ReactNode;
  variant?: AlertVariant;
  title?: string;
  onClose?: () => void;
  className?: string;
}

const variantStyles: Record<
  AlertVariant,
  { container: string; text: string; icon: typeof AlertCircle; iconColor: string }
> = {
  error: {
    container: "bg-red-50 border-red-200",
    text: "text-red-700",
    icon: AlertCircle,
    iconColor: "text-red-600",
  },
  success: {
    container: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-800",
    icon: CheckCircle2,
    iconColor: "text-emerald-600",
  },
  warning: {
    container: "bg-amber-50 border-amber-200",
    text: "text-amber-800",
    icon: AlertTriangle,
    iconColor: "text-amber-600",
  },
  info: {
    container: "bg-blue-50 border-blue-200",
    text: "text-blue-800",
    icon: Info,
    iconColor: "text-blue-600",
  },
};

export default function Alert({
  children,
  variant = "info",
  title,
  onClose,
  className = "",
}: AlertProps) {
  const { container, text, icon: Icon, iconColor } = variantStyles[variant];

  return (
    <div
      role="alert"
      className={`flex items-start gap-2.5 border p-3 rounded-sm text-xs font-semibold ${container} ${text} ${className}`}
    >
      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} />
      <div className="flex-1">
        {title && <h4 className="font-bold text-sm mb-0.5">{title}</h4>}
        <div className="leading-relaxed">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 shrink-0 cursor-pointer"
          aria-label="Close alert"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
