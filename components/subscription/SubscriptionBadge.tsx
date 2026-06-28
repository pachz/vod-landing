import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type SubscriptionBadgeVariant =
  | 'default'
  | 'featured'
  | 'vip'
  | 'locked'
  | 'limited'
  | 'gold'

const variantStyles: Record<SubscriptionBadgeVariant, string> = {
  default: 'bg-pink-100 text-pink-800 border border-pink-200',
  featured: 'bg-white/20 text-white border border-white/40',
  vip: 'bg-purple-500 text-white border border-purple-500',
  locked: 'bg-gray-100 text-gray-500 border border-gray-200',
  limited: 'bg-amber-50 text-amber-800 border border-amber-200',
  gold: 'bg-gradient-to-r from-amber-300 to-amber-500 text-amber-950 border border-amber-400 shadow-sm',
}

interface SubscriptionBadgeProps {
  variant?: SubscriptionBadgeVariant
  children: ReactNode
  className?: string
}

export default function SubscriptionBadge({
  variant = 'default',
  children,
  className,
}: SubscriptionBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full tracking-wide',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
