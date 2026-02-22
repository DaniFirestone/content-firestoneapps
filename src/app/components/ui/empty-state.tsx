import { AlertCircle, FileQuestion, Package, Lightbulb, Inbox, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

type EmptyStateVariant = 'tasks' | 'processes' | 'assets' | 'ideas' | 'generic';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

const variantConfig: Record<
  EmptyStateVariant,
  { icon: any; title: string; description: string; iconColor: string }
> = {
  tasks: {
    icon: AlertCircle,
    title: 'No tasks yet',
    description: 'Create your first task to get started with project management and track your progress.',
    iconColor: 'text-orange-500',
  },
  processes: {
    icon: Package,
    title: 'No processes defined',
    description: 'Set up your first process to streamline your workflow and increase efficiency.',
    iconColor: 'text-blue-500',
  },
  assets: {
    icon: Inbox,
    title: 'No assets found',
    description: 'Upload images, documents, or add prompts to build your asset library.',
    iconColor: 'text-purple-500',
  },
  ideas: {
    icon: Lightbulb,
    title: 'No ideas captured',
    description: 'Start capturing your app ideas and turn them into reality with the App Incubator.',
    iconColor: 'text-yellow-500',
  },
  generic: {
    icon: FileQuestion,
    title: 'Nothing here yet',
    description: 'Get started by adding your first item and building something great.',
    iconColor: 'text-muted-foreground',
  },
};

export function EmptyState({
  variant = 'generic',
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}: EmptyStateProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;
  const displayTitle = title || config.title;
  const displayDescription = description || config.description;

  return (
    <Card className="border-dashed bg-muted/20">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className={`mb-6 rounded-full bg-background p-4 shadow-sm`}>
          <Icon className={`h-12 w-12 ${config.iconColor}`} />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-foreground">{displayTitle}</h3>
        <p className="mb-8 max-w-md text-sm text-muted-foreground leading-relaxed">
          {displayDescription}
        </p>
        <div className="flex gap-3">
          {actionLabel && onAction && (
            <Button onClick={onAction} size="lg">
              <Sparkles className="mr-2 h-4 w-4" />
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button onClick={onSecondaryAction} variant="outline" size="lg">
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}