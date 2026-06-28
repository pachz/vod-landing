import { cn } from "@/lib/utils";
import { PlanIcon } from "@/lib/plan-icons";
import type { PlanCardVariant } from "@/lib/subscription/types";

interface FeatureItemProps {
  icon: string;
  title: string;
  description?: string;
  accent?: PlanCardVariant;
  dense?: boolean;
}

const accentIconStyles: Record<PlanCardVariant, string> = {
  default: "bg-pink-300/10 text-pink-500",
  featured: "bg-pink-300/10 text-pink-500",
  vip: "bg-purple-100 text-purple-600",
};

const accentTitleStyles: Record<PlanCardVariant, string> = {
  default: "text-purple-800",
  featured: "text-purple-800",
  vip: "text-purple-900",
};

const accentDescriptionStyles: Record<PlanCardVariant, string> = {
  default: "text-text-secondary",
  featured: "text-text-secondary",
  vip: "text-purple-600",
};

export default function FeatureItem({
  icon,
  title,
  description,
  accent = "default",
  dense = false,
}: FeatureItemProps) {
  const isTitleOnly = !description;

  return (
    <div
      className={cn(
        "flex gap-3 border-b border-purple-100/80 last:border-b-0",
        dense ? "py-2" : "py-3",
        isTitleOnly ? "items-center" : "items-start"
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
          !isTitleOnly && "mt-0.5",
          accentIconStyles[accent]
        )}
      >
        <PlanIcon icon={icon} className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0 text-start">
        <p
          className={cn(
            "text-sm font-semibold leading-snug",
            accentTitleStyles[accent]
          )}
        >
          {title}
        </p>
        {description && (
          <p
            className={cn(
              "text-xs sm:text-sm mt-0.5 leading-relaxed",
              accentDescriptionStyles[accent]
            )}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
