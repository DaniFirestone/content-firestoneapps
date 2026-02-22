import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Plus, Sparkles, Lightbulb, Layers, X } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';

export function MobileFloatingActions() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Hide FAB on certain pages where it doesn't make sense
  const hiddenPaths = ['/capture', '/settings', '/help'];
  const shouldHide = hiddenPaths.includes(location.pathname);

  if (shouldHide) return null;

  const actions = [
    {
      icon: Sparkles,
      label: 'Quick Capture',
      href: '/capture',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      icon: Lightbulb,
      label: 'New App Idea',
      href: '/app-incubator',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      icon: Layers,
      label: 'App Workspaces',
      href: '/app-hub',
      color: 'bg-green-500 hover:bg-green-600',
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 sm:hidden">
      {/* Action Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 flex flex-col gap-3 mb-2">
          {actions.map((action, index) => (
            <Link
              key={action.href}
              to={action.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-full shadow-lg text-white transition-all',
                action.color,
                'animate-in slide-in-from-bottom-2 fade-in',
              )}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <action.icon className="h-5 w-5" />
              <span className="text-sm font-medium whitespace-nowrap">{action.label}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <Button
        size="lg"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'h-14 w-14 rounded-full shadow-lg transition-all',
          isOpen ? 'bg-destructive hover:bg-destructive/90 rotate-45' : 'bg-primary hover:bg-primary/90'
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Plus className="h-6 w-6" />
        )}
        <span className="sr-only">Quick Actions</span>
      </Button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 -z-10 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}