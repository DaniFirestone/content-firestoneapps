import { type LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  icon?: LucideIcon;
  iconColor?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  size?: 'default' | 'large';
}

export function SectionHeader({
  icon: Icon,
  iconColor = 'text-primary',
  title,
  description,
  actions,
  size = 'default',
}: SectionHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {Icon && <Icon className={`${size === 'large' ? 'h-5 w-5' : 'h-4 w-4'} ${iconColor}`} />}
            <h2 className={`${size === 'large' ? 'text-2xl' : 'text-lg'} font-semibold`}>
              {title}
            </h2>
          </div>
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
    </div>
  );
}
