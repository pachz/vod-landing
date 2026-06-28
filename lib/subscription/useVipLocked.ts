'use client'

import { useSearchParams } from 'next/navigation'
import { DEFAULT_VIP_LOCKED } from './config'

/**
 * Resolves VIP locked state from URL (?vipLocked=true|false) with config fallback.
 * Easily replaceable when backend capacity is wired in.
 */
export function useVipLocked(): boolean {
  const searchParams = useSearchParams()
  const param = searchParams.get('vipLocked')

  if (param === 'true') return true
  if (param === 'false') return false
  return DEFAULT_VIP_LOCKED
}
