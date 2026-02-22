import { SidebarTrigger } from '../ui/sidebar';
import { ThemeToggle } from './ThemeToggle';
import { useSelectedApp } from '../../contexts/SelectedAppContext';
import { Link } from 'react-router';
import { Button } from '../ui/button';
import { ExternalLink, ChevronDown, Check } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '../ui/dropdown-menu';
import { toast } from 'sonner';

export function Header() {
  const { selectedApp, setSelectedApp } = useSelectedApp();
  const { appConcepts } = useData();

  // Get all production/active apps
  const allApps = appConcepts.filter(app =>
    app.status === 'production' || app.status === 'prototyping'
  );

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 md:gap-4 border-b bg-background/95 px-3 md:px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger />
      
      {/* App Switcher Dropdown */}
      <div className="h-5 w-px bg-border hidden sm:block" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="gap-1.5 md:gap-2 px-2 md:px-3 max-w-[180px] md:max-w-none"
          >
            {selectedApp ? (
              <>
                <div 
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: selectedApp.color || 'hsl(var(--primary))' }}
                />
                <span className="font-medium truncate text-sm md:text-base">{selectedApp.name}</span>
              </>
            ) : (
              <span className="text-muted-foreground text-sm md:text-base">Select App</span>
            )}
            <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel>Switch App</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {allApps.length > 0 ? (
            <>
              {allApps.map((app) => (
                <DropdownMenuItem
                  key={app.id}
                  onClick={() => {
                    setSelectedApp(app);
                    toast.success(`Switched to ${app.name}`);
                  }}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <div 
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: app.color }}
                  />
                  <span className="flex-1">{app.name}</span>
                  {selectedApp?.id === app.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
              {selectedApp && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedApp(null);
                      toast.info('App deselected');
                    }}
                    className="text-muted-foreground cursor-pointer"
                  >
                    Clear Selection
                  </DropdownMenuItem>
                </>
              )}
            </>
          ) : (
            <div className="px-2 py-6 text-center text-sm text-muted-foreground">
              No apps available
            </div>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/app-hub" className="cursor-pointer">
              Browse All Apps
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Quick Link to Workspace - Hidden on mobile */}
      {selectedApp && (
        <Button asChild variant="ghost" size="sm" className="gap-1.5 md:gap-2 hidden md:flex">
          <Link to={`/workspace/${selectedApp.id}`}>
            <span className="text-xs">Workspace</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </Button>
      )}

      <div className="ml-auto flex items-center gap-1 md:gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}