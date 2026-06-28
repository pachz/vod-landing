"use client";

import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Crown,
  Gift,
  GraduationCap,
  Heart,
  HelpCircle,
  Medal,
  MessageCircle,
  Percent,
  Ribbon,
  Shield,
  Sparkles,
  Star,
  Users,
  Video,
  Zap,
} from "lucide-react";
import {
  DEFAULT_PLAN_ICON,
  isPlanIconKey,
  type PlanIconKey,
} from "@/lib/plan-constants";

export const PLAN_ICON_MAP: Record<PlanIconKey, LucideIcon> = {
  GraduationCap,
  BookOpen,
  Heart,
  MessageCircle,
  HelpCircle,
  Crown,
  Video,
  Calendar,
  Percent,
  Star,
  Sparkles,
  Gift,
  Ribbon,
  Medal,
  Users,
  Shield,
  Zap,
  CheckCircle2,
};

export function getPlanIcon(key: string): LucideIcon {
  return isPlanIconKey(key) ? PLAN_ICON_MAP[key] : PLAN_ICON_MAP[DEFAULT_PLAN_ICON];
}

export function PlanIcon({
  icon,
  className,
}: {
  icon?: string | null;
  className?: string;
}) {
  const Icon = getPlanIcon(icon ?? DEFAULT_PLAN_ICON);
  return <Icon className={className} aria-hidden />;
}
