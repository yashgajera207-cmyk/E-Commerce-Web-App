import type { LucideIcon } from "lucide-react";
import Button from "./Button";

interface EmptyStateProps {
  icon?: LucideIcon;
  emoji?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionTo?: string;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  emoji,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-20 px-6 text-center ${className}`}>
      {/* Icon / Emoji */}
      <div className="mb-6">
        {emoji ? (
          <span className="text-6xl block">{emoji}</span>
        ) : Icon ? (
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto">
            <Icon className="w-10 h-10 text-[#2874f0]" />
          </div>
        ) : null}
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>

      {description && (
        <p className="text-sm text-gray-500 max-w-xs mb-6 leading-relaxed">{description}</p>
      )}

      {actionLabel && onAction && (
        <Button variant="blue" size="md" onClick={onAction} className="min-w-[160px]">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
