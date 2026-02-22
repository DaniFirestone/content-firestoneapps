import { cn } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface ColorSwatchProps {
  color: string;
  label?: string;
  sublabel?: string;
  variant?: 'dot' | 'small' | 'medium' | 'large' | 'styleguide';
  showCopy?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Unified ColorSwatch component for consistent color display across the app
 * 
 * Variants:
 * - dot: Tiny circle (12px) - for inline/compact displays
 * - small: Small square (32px) with optional label - for cards/lists
 * - medium: Medium square (40px) with label - for detail views
 * - large: Large square (80px) with label - for edit forms
 * - styleguide: Extra large (133px) - for style guide showcase
 */
export function ColorSwatch({
  color,
  label,
  sublabel,
  variant = 'medium',
  showCopy = false,
  onClick,
  className,
}: ColorSwatchProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    } else if (showCopy) {
      handleCopy(e);
    }
  };

  // Dot variant - minimal inline circle
  if (variant === 'dot') {
    return (
      <div
        className={cn(
          'h-3 w-3 rounded-full border border-border shrink-0 transition-transform hover:scale-110',
          (onClick || showCopy) && 'cursor-pointer',
          className
        )}
        style={{ backgroundColor: color }}
        title={color}
        onClick={handleClick}
      />
    );
  }

  // Small variant - compact with side label
  if (variant === 'small') {
    return (
      <div
        className={cn(
          'flex items-center gap-2',
          (onClick || showCopy) && 'cursor-pointer group',
          className
        )}
        onClick={handleClick}
      >
        <div
          className={cn(
            'h-8 w-8 rounded border border-border shrink-0 transition-transform',
            (onClick || showCopy) && 'group-hover:scale-105'
          )}
          style={{ backgroundColor: color }}
        />
        {label && (
          <div className="text-xs">
            <div className="font-medium">{label}</div>
            <div className="text-muted-foreground font-mono">{sublabel || color}</div>
          </div>
        )}
      </div>
    );
  }

  // Medium variant - standard detail view
  if (variant === 'medium') {
    return (
      <div
        className={cn(
          'flex items-center gap-3 rounded-lg border p-3 transition-colors',
          (onClick || showCopy) && 'cursor-pointer hover:bg-muted/50',
          className
        )}
        onClick={handleClick}
      >
        <div
          className="h-10 w-10 rounded border border-border shrink-0"
          style={{ backgroundColor: color }}
        />
        <div className="flex-1">
          <div className="text-sm font-medium">{label}</div>
          <div className="text-xs text-muted-foreground font-mono">{sublabel || color}</div>
        </div>
        {showCopy && (
          <div className="text-muted-foreground">
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </div>
        )}
      </div>
    );
  }

  // Large variant - edit forms with prominent display
  if (variant === 'large') {
    return (
      <div
        className={cn(
          'flex flex-col gap-2',
          (onClick || showCopy) && 'cursor-pointer',
          className
        )}
        onClick={handleClick}
      >
        <div
          className={cn(
            'h-20 w-20 rounded-lg border-2 border-border shadow-sm transition-all',
            (onClick || showCopy) && 'hover:scale-105 hover:shadow-md'
          )}
          style={{ backgroundColor: color }}
        />
        {label && (
          <div className="text-center">
            <div className="text-sm font-medium">{label}</div>
            <div className="text-xs text-muted-foreground font-mono">{sublabel || color}</div>
          </div>
        )}
      </div>
    );
  }

  // Style guide variant - showcase display
  if (variant === 'styleguide') {
    return (
      <div className={cn('space-y-4', className)}>
        <button
          onClick={handleClick}
          className="w-full h-[133px] rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          style={{ backgroundColor: color }}
          title={`Click to copy ${color}`}
        />
        <div>
          {label && <p className="text-sm font-medium mb-1">{label}</p>}
          <p className="text-xs font-mono text-gray-500">{color.toUpperCase()}</p>
          {sublabel && <p className="text-xs text-gray-400 mt-2">{sublabel}</p>}
        </div>
        {copied && (
          <div className="flex items-center gap-1 text-xs text-green-600">
            <Check className="h-3 w-3" />
            <span>Copied!</span>
          </div>
        )}
      </div>
    );
  }

  return null;
}

/**
 * ColorSwatchGroup - Display multiple color swatches together
 */
interface ColorSwatchGroupProps {
  colors: Array<{ color: string; label: string; sublabel?: string }>;
  variant?: ColorSwatchProps['variant'];
  className?: string;
}

export function ColorSwatchGroup({ colors, variant = 'small', className }: ColorSwatchGroupProps) {
  if (variant === 'dot') {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        {colors.map((c, i) => (
          <ColorSwatch key={i} color={c.color} variant="dot" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('flex gap-3 flex-wrap', className)}>
      {colors.map((c, i) => (
        <ColorSwatch
          key={i}
          color={c.color}
          label={c.label}
          sublabel={c.sublabel}
          variant={variant}
        />
      ))}
    </div>
  );
}
