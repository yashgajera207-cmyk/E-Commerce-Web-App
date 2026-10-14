import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1 text-xs text-gray-500 flex-wrap ${className}`}>
      <Link to="/" className="flex items-center gap-1 hover:text-[#2874f0] transition-colors shrink-0">
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>

      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
          {item.to && index < items.length - 1 ? (
            <Link to={item.to} className="hover:text-[#2874f0] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-800 font-medium truncate max-w-[160px]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
