// Design tokens and system configuration

export const spacing = {
  page: {
    padding: 'p-6 lg:p-8',
    container: 'max-w-7xl mx-auto',
  },
  section: {
    gap: 'space-y-6',
    marginBottom: 'mb-6',
  },
  card: {
    padding: 'p-6',
    gap: 'space-y-4',
  },
  form: {
    gap: 'space-y-4',
  },
  grid: {
    cols2: 'grid grid-cols-1 md:grid-cols-2 gap-6',
    cols3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    cols4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
  },
};

export const typography = {
  headline: {
    h1: 'font-headline text-4xl lg:text-5xl font-bold',
    h2: 'font-headline text-3xl lg:text-4xl font-bold',
    h3: 'font-headline text-2xl lg:text-3xl font-semibold',
    h4: 'font-headline text-xl lg:text-2xl font-semibold',
  },
  body: {
    large: 'text-lg',
    base: 'text-base',
    small: 'text-sm',
    xs: 'text-xs',
  },
};

export const colors = {
  status: {
    idea: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-800 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
    },
    brainstorming: {
      bg: 'bg-indigo-100 dark:bg-indigo-900/30',
      text: 'text-indigo-800 dark:text-indigo-300',
      border: 'border-indigo-200 dark:border-indigo-800',
    },
    prototyping: {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-800 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800',
    },
    final: {
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      text: 'text-emerald-800 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800',
    },
    planning: {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      text: 'text-purple-800 dark:text-purple-300',
      border: 'border-purple-200 dark:border-purple-800',
    },
    development: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-800 dark:text-yellow-300',
      border: 'border-yellow-200 dark:border-yellow-800',
    },
    testing: {
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      text: 'text-orange-800 dark:text-orange-300',
      border: 'border-orange-200 dark:border-orange-800',
    },
    published: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-300',
      border: 'border-green-200 dark:border-green-800',
    },
    active: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-300',
      border: 'border-green-200 dark:border-green-800',
    },
    draft: {
      bg: 'bg-gray-100 dark:bg-gray-900/30',
      text: 'text-gray-800 dark:text-gray-300',
      border: 'border-gray-200 dark:border-gray-800',
    },
    archived: {
      bg: 'bg-gray-100 dark:bg-gray-900/30',
      text: 'text-gray-800 dark:text-gray-300',
      border: 'border-gray-200 dark:border-gray-800',
    },
    todo: {
      bg: 'bg-gray-100 dark:bg-gray-900/30',
      text: 'text-gray-800 dark:text-gray-300',
      border: 'border-gray-200 dark:border-gray-800',
    },
    'in-progress': {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-800 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
    },
    review: {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      text: 'text-purple-800 dark:text-purple-300',
      border: 'border-purple-200 dark:border-purple-800',
    },
    completed: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-300',
      border: 'border-green-200 dark:border-green-800',
    },
    low: {
      bg: 'bg-gray-100 dark:bg-gray-900/30',
      text: 'text-gray-800 dark:text-gray-300',
      border: 'border-gray-200 dark:border-gray-800',
    },
    medium: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-800 dark:text-yellow-300',
      border: 'border-yellow-200 dark:border-yellow-800',
    },
    high: {
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      text: 'text-orange-800 dark:text-orange-300',
      border: 'border-orange-200 dark:border-orange-800',
    },
    urgent: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-800 dark:text-red-300',
      border: 'border-red-200 dark:border-red-800',
    },
  },
};

// App/Business status types used across components
export type AppStatus =
  | 'idea'
  | 'brainstorming'
  | 'prototyping'
  | 'final'
  | 'planning'
  | 'development'
  | 'testing'
  | 'published'
  | 'active'
  | 'draft'
  | 'archived'
  | 'todo'
  | 'in-progress'
  | 'review'
  | 'completed'
  | 'low'
  | 'medium'
  | 'high'
  | 'urgent';

export interface StatusConfig {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  className: string;
}

export function getStatusConfig(status: string): StatusConfig {
  const statusMap: Record<string, StatusConfig> = {
    idea: {
      label: 'Idea',
      variant: 'default',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    },
    brainstorming: {
      label: 'Brainstorming',
      variant: 'default',
      className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    },
    prototyping: {
      label: 'Prototyping',
      variant: 'default',
      className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    },
    final: {
      label: 'Final',
      variant: 'default',
      className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    },
    planning: {
      label: 'Planning',
      variant: 'default',
      className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    },
    development: {
      label: 'Development',
      variant: 'default',
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    },
    testing: {
      label: 'Testing',
      variant: 'default',
      className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    },
    published: {
      label: 'Published',
      variant: 'default',
      className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    },
    active: {
      label: 'Active',
      variant: 'default',
      className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    },
    draft: {
      label: 'Draft',
      variant: 'secondary',
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
    },
    archived: {
      label: 'Archived',
      variant: 'outline',
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
    },
    todo: {
      label: 'To Do',
      variant: 'secondary',
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
    },
    'in-progress': {
      label: 'In Progress',
      variant: 'default',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    },
    review: {
      label: 'Review',
      variant: 'default',
      className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    },
    completed: {
      label: 'Completed',
      variant: 'default',
      className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    },
    low: {
      label: 'Low',
      variant: 'secondary',
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
    },
    medium: {
      label: 'Medium',
      variant: 'default',
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    },
    high: {
      label: 'High',
      variant: 'default',
      className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    },
    urgent: {
      label: 'Urgent',
      variant: 'destructive',
      className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    },
  };

  return statusMap[status] || {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    variant: 'default',
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
  };
}

export const elevation = {
  level0: 'shadow-none',
  level1: 'shadow-sm',
  level2: 'shadow-md',
  level3: 'shadow-lg',
  level4: 'shadow-xl',
};

export const borderRadius = {
  small: 'rounded-sm',
  medium: 'rounded-md',
  large: 'rounded-lg',
  xlarge: 'rounded-xl',
  full: 'rounded-full',
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