import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PlanVariant } from '@/lib/subscription/plans'

interface FeatureItemProps {
  icon: LucideIcon
  title: string
  description?: string
  accent?: PlanVariant
  dense?: boolean
}

const accentIconStyles: Record<PlanVariant, string> = {
  default: 'bg-pink-300/10 text-pink-500',
  featured: 'bg-white/20 text-white',
  vip: 'bg-purple-100 text-purple-600',
}

const accentTitleStyles: Record<PlanVariant, string> = {
  default: 'text-purple-800',
  featured: 'text-white',
  vip: 'text-purple-900',
}

const accentDescriptionStyles: Record<PlanVariant, string> = {
  default: 'text-text-secondary',
  featured: 'text-white/75',
  vip: 'text-purple-600',
}

export default function FeatureItem({
  icon: Icon,
  title,
  description,
  accent = 'default',
  dense = false,
}: FeatureItemProps) {
  const isTitleOnly = !description

  return (
    <div
      className={cn(
        'flex gap-3 border-b border-purple-100/80 last:border-b-0',
        dense ? 'py-2' : 'py-3',
        isTitleOnly ? 'items-center' : 'items-start'
      )}
    >
      <div
        className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
          !isTitleOnly && 'mt-0.5',
          accentIconStyles[accent]
        )}
      >
        <Icon className="w-4 h-4" aria-hidden />
      </div>
      <div className="flex-1 min-w-0 text-start">
        <p className={cn('text-sm font-semibold leading-snug', accentTitleStyles[accent])}>
          {title}
        </p>
        {description && (
          <p className={cn('text-xs sm:text-sm mt-0.5 leading-relaxed', accentDescriptionStyles[accent])}>
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
