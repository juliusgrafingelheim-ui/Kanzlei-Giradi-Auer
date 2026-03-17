/**
 * Icon Map: Storyblok text field value → Lucide React component
 *
 * In Storyblok, create a "Text" field with the icon name.
 * Type e.g. "Scale", "Home", "Users" and the correct Lucide icon renders.
 *
 * Only icons actually used across the site are included to keep the bundle small.
 */

import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Award,
  Building,
  Calendar,
  Check,
  Clock,
  FileCheck,
  FileText,
  Heart,
  HeartHandshake,
  Home,
  Mail,
  MapPin,
  Phone,
  Scale,
  Search,
  Shield,
  Star,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

export type IconComponent = LucideIcon;

/**
 * Map of icon name strings → Lucide components.
 * Keys are PascalCase (matching Lucide export names).
 */
export const ICON_MAP: Record<string, LucideIcon> = {
  ArrowRight,
  Award,
  Building,
  Calendar,
  Check,
  Clock,
  FileCheck,
  FileText,
  Heart,
  HeartHandshake,
  Home,
  Mail,
  MapPin,
  Phone,
  Scale,
  Search,
  Shield,
  Star,
  Target,
  TrendingUp,
  Users,
};

/**
 * Helper: Get all available icon names (for admin UI / dropdown)
 */
export function getAvailableIconNames(): string[] {
  return Object.keys(ICON_MAP).sort();
}