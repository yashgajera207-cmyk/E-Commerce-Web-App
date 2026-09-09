import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  onViewAll?: () => void;
}

export default function SectionHeader({ title, subtitle, onViewAll }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-display text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {onViewAll && (
        <button
          onClick={onViewAll}
          className="flex items-center text-sm font-semibold text-brand-blue hover:text-brand-blue-dark shrink-0 cursor-pointer"
        >
          View all
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
