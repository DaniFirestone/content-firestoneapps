import { LucideIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'motion/react';

interface BetterEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  gradient?: 'blue' | 'purple' | 'green' | 'orange';
}

export function BetterEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  gradient = 'blue',
}: BetterEmptyStateProps) {
  const gradients = {
    blue: 'from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20',
    purple: 'from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20',
    green: 'from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20',
    orange: 'from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20',
  };

  const iconColors = {
    blue: 'text-blue-500',
    purple: 'text-purple-500',
    green: 'text-emerald-500',
    orange: 'text-orange-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${gradients[gradient]} border border-muted-foreground/10 p-12 text-center`}
    >
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-white/40 to-transparent dark:from-white/5 rounded-full -ml-24 -mb-24 blur-3xl" />
      
      <div className="relative">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-gray-800 shadow-lg mb-4"
        >
          <Icon className={`h-8 w-8 ${iconColors[gradient]}`} />
        </motion.div>
        
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">{description}</p>
        
        {actionLabel && onAction && (
          <Button onClick={onAction} size="sm">
            {actionLabel}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
