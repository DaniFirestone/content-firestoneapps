// Design Tokens for Content Hub

import {
  Eye,
  EyeOff,
  Construction,
  MessageCircle,
  Lightbulb,
  Archive,
  type LucideIcon,
} from 'lucide-react';

// Typography Tokens
export const typography = {
  pageTitle: 'text-4xl font-headline font-bold text-primary',
  pageSubtitle: 'text-lg font-body text-foreground/80',
  sectionTitle: 'text-2xl font-headline font-semibold text-foreground',
  cardTitle: 'text-xl font-headline font-semibold text-foreground',
  subsectionTitle: 'text-lg font-headline font-medium text-foreground',
  body: 'text-base font-body text-foreground',
  bodySmall: 'text-sm font-body text-foreground',
  caption: 'text-xs font-body text-muted-foreground',
  label: 'text-sm font-medium text-foreground',
};

// Spacing Tokens
export const spacing = {
  page: {
    padding: 'py-8 px-4',
    container: 'container mx-auto',
  },
  section: {
    gap: 'space-y-8',
    titleMarginBottom: 'mb-6',
  },
  subsection: {
    gap: 'space-y-4',
  },
  card: {
    gridGap: 'gap-8',
    header: 'p-6',
    content: 'p-6 pt-4',
    footer: 'p-4',
  },
  form: {
    gap: 'gap-4',
  },
};

// Grid Tokens
export const grid = {
  gapTight: 'gap-4',
  gapDefault: 'gap-6',
  gapLoose: 'gap-8',
};

// Container Tokens
export const container = {
  default: 'px-4 sm:px-6 lg:px-8',
  narrow: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',
  wide: 'px-4 sm:px-6 lg:px-8',
};

// Elevation Tokens
export const elevation = {
  flat: '',
  low: 'shadow-elevation-1',
  medium: 'shadow-elevation-2',
  high: 'shadow-elevation-3',
  highest: 'shadow-elevation-4',
};

// Transition Tokens
export const transitions = {
  fast: 'transition-all duration-150 ease-out',
  normal: 'transition-all duration-200 ease-out',
  slow: 'transition-all duration-300 ease-in-out',
};

// Status Tokens
export type AppStatus =
  | 'published'
  | 'hidden'
  | 'prototyping'
  | 'brainstorming'
  | 'idea'
  | 'archived';

export interface StatusConfig {
  label: string;
  icon: LucideIcon;
  textColor: string;
  bgColor: string;
  borderColor: string;
  hoverColor: string;
  darkTextColor: string;
}

export const statusTokens: Record<AppStatus, StatusConfig> = {
  published: {
    label: 'Published',
    icon: Eye,
    textColor: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
    hoverColor: 'hover:bg-green-200',
    darkTextColor: 'text-green-800',
  },
  hidden: {
    label: 'Hidden',
    icon: EyeOff,
    textColor: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
    hoverColor: 'hover:bg-gray-200',
    darkTextColor: 'text-gray-800',
  },
  prototyping: {
    label: 'Prototyping',
    icon: Construction,
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-300',
    hoverColor: 'hover:bg-purple-200',
    darkTextColor: 'text-purple-800',
  },
  brainstorming: {
    label: 'Brainstorming',
    icon: MessageCircle,
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
    hoverColor: 'hover:bg-blue-200',
    darkTextColor: 'text-blue-800',
  },
  idea: {
    label: 'Idea',
    icon: Lightbulb,
    textColor: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-300',
    hoverColor: 'hover:bg-yellow-200',
    darkTextColor: 'text-yellow-800',
  },
  archived: {
    label: 'Archived',
    icon: Archive,
    textColor: 'text-slate-600',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-300',
    hoverColor: 'hover:bg-slate-200',
    darkTextColor: 'text-slate-800',
  },
};

// Health Status Tokens
export type HealthLevel = 'critical' | 'warning' | 'good';

export interface HealthConfig {
  label: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  minThreshold: number;
  maxThreshold: number;
}

export const healthTokens: Record<HealthLevel, HealthConfig> = {
  critical: {
    label: 'Blocked',
    textColor: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    minThreshold: 0,
    maxThreshold: 69,
  },
  warning: {
    label: 'Needs Attention',
    textColor: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    minThreshold: 70,
    maxThreshold: 89,
  },
  good: {
    label: 'Looking Good',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    minThreshold: 90,
    maxThreshold: 100,
  },
};

// Navigation Phase Tokens
export type NavigationPhase = 'create' | 'develop' | 'manage' | 'output' | 'system';

export interface PhaseConfig {
  label: string;
  color: string;
  emoji?: string;
}

export const phaseTokens: Record<NavigationPhase, PhaseConfig> = {
  create: {
    label: 'Create',
    color: 'text-amber-500',
    emoji: '⭐',
  },
  develop: {
    label: 'Develop',
    color: 'text-blue-500',
    emoji: '🚀',
  },
  manage: {
    label: 'Manage',
    color: 'text-emerald-500',
    emoji: '📈',
  },
  output: {
    label: 'Output',
    color: 'text-purple-500',
    emoji: '📤',
  },
  system: {
    label: 'System',
    color: 'text-muted-foreground',
  },
};

// Helper function to get health level from score
export function getHealthLevel(score: number): HealthLevel {
  if (score >= 90) return 'good';
  if (score >= 70) return 'warning';
  return 'critical';
}

// Helper function to get status config
export function getStatusConfig(status: AppStatus): StatusConfig {
  return statusTokens[status];
}

// Helper function to get health config
export function getHealthConfig(level: HealthLevel): HealthConfig {
  return healthTokens[level];
}
