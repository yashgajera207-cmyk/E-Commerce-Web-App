export type SpinnerSize = "sm" | "md" | "lg";
export type SpinnerColor = "white" | "primary" | "blue" | "gray";

interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  className?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-3",
};

const colorClasses: Record<SpinnerColor, string> = {
  white: "border-white/30 border-t-white",
  primary: "border-orange-200 border-t-[#fb641b]",
  blue: "border-blue-200 border-t-[#2874f0]",
  gray: "border-gray-200 border-t-gray-600",
};

export default function Spinner({
  size = "md",
  color = "primary",
  className = "",
}: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
