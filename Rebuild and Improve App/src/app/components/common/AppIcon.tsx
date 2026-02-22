import { Package } from 'lucide-react';

interface AppIconProps {
  appName: string;
  iconUrl?: string;
  primaryColor?: string;
  accentColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-2xl',
};

export function AppIcon({
  appName,
  iconUrl,
  primaryColor,
  accentColor,
  size = 'md',
  className = '',
}: AppIconProps) {
  const firstLetter = appName.charAt(0).toUpperCase();
  
  // If icon URL is provided, show the icon
  if (iconUrl) {
    return (
      <div className={`${sizeClasses[size]} rounded-lg overflow-hidden shrink-0 ${className}`}>
        <img src={iconUrl} alt={appName} className="w-full h-full object-cover" />
      </div>
    );
  }
  
  // Otherwise show colored square with letter
  const hasColors = primaryColor && accentColor;
  
  return (
    <div
      className={`${sizeClasses[size]} rounded-lg flex items-center justify-center text-white font-semibold shrink-0 shadow-sm ${className}`}
      style={
        hasColors
          ? {
              background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
            }
          : {
              background: 'hsl(var(--primary))',
            }
      }
    >
      {firstLetter}
    </div>
  );
}
