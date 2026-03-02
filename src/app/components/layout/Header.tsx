import { SidebarTrigger } from '../ui/sidebar';
import { ThemeToggle } from './ThemeToggle';
import { useSelectedApp } from '../../contexts/SelectedAppContext';
import { useLocation } from 'react-router';
import { Button } from '../ui/button';
import { ExternalLink, ChevronDown, Check, X, Sparkles, Building2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '../ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { useState } from 'react';

export function Header() {
  const { selectedApp, setSelectedApp } = useSelectedApp();
  const { appConcepts, businesses } = useData();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Get all production/active apps
  const allApps = appConcepts.filter(app =>
    app.status === 'published' || app.status === 'prototyping'
  );

  // Get business for selected app
  const business = selectedApp?.businessId
    ? businesses.find(b => b.id === selectedApp.businessId)
    : null;

  // Determine if we're in a workspace context
  const isWorkspacePage = location.pathname.startsWith('/workspace');
  const isAssetsPage = location.pathname.startsWith('/assets');
  const isTasksPage = location.pathname.startsWith('/tasks');
  const showAppContext = selectedApp && (isWorkspacePage || isAssetsPage || isTasksPage);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 md:gap-4 border-b bg-background/95 px-3 md:px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger />

      {/* App Context - Clean, Prominent Display */}
      {showAppContext ? (
        <>
          <div className="h-5 w-px bg-border hidden sm:block" />

          {/* Current App Display */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                role="combobox"
                aria-expanded={open}
                className="gap-2 px-3 h-9 hover:bg-accent/50 group"
              >
                {/* App Icon */}
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                  style={{
                    backgroundColor: selectedApp.color || 'hsl(var(--primary))',
                  }}
                >
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>

                {/* App Name */}
                <div className="flex flex-col items-start min-w-0">
                  <span className="font-semibold text-sm truncate max-w-[120px] md:max-w-[200px]">
                    {selectedApp.name}
                  </span>
                  {business && (
                    <span className="text-xs text-muted-foreground truncate max-w-[120px] md:max-w-[200px]">
                      {business.companyName}
                    </span>
                  )}
                </div>

                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search apps..." />
                <CommandList>
                  <CommandEmpty>No apps found.</CommandEmpty>
                  <CommandGroup heading="Your Apps">
                    {allApps.map((app) => {
                      const appBusiness = app.businessId
                        ? businesses.find(b => b.id === app.businessId)
                        : null;
                      return (
                        <CommandItem
                          key={app.id}
                          value={app.name}
                          onSelect={() => {
                            setSelectedApp({
                              id: app.id,
                              name: app.name,
                              color: app.color,
                              businessId: app.businessId,
                            });
                            setOpen(false);
                            toast.success(`Switched to ${app.name}`);
                          }}
                          className="flex items-center gap-3 py-2.5 cursor-pointer"
                        >
                          <div
                            className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                            style={{ backgroundColor: app.color || 'hsl(var(--primary))' }}
                          >
                            <Sparkles className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="font-medium text-sm truncate">{app.name}</span>
                            {appBusiness && (
                              <span className="text-xs text-muted-foreground truncate">
                                {appBusiness.companyName}
                              </span>
                            )}
                          </div>
                          {selectedApp?.id === app.id && (
                            <Check className="h-4 w-4 text-primary shrink-0" />
                          )}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => {
                        setSelectedApp(null);
                        setOpen(false);
                        toast.info('App context cleared');
                      }}
                      className="text-muted-foreground cursor-pointer"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear Selection
                    </CommandItem>
                    <CommandItem
                      onSelect={() => {
                        setOpen(false);
                        window.location.href = '/app-hub';
                      }}
                      className="cursor-pointer"
                    >
                      <Building2 className="h-4 w-4 mr-2" />
                      Browse All Apps
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Context Badge */}
          {isWorkspacePage && (
            <Badge variant="secondary" className="hidden md:flex gap-1 text-xs">
              <ExternalLink className="h-3 w-3" />
              Workspace
            </Badge>
          )}
          {isAssetsPage && (
            <Badge variant="outline" className="hidden md:flex text-xs">
              Assets
            </Badge>
          )}
          {isTasksPage && (
            <Badge variant="outline" className="hidden md:flex text-xs">
              Tasks
            </Badge>
          )}
        </>
      ) : (
        // No app selected or not on context-relevant page - Show minimal selector
        <>
          <div className="h-5 w-px bg-border hidden sm:block" />
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <Sparkles className="h-4 w-4" />
                <span className="text-sm">Select App</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search apps..." />
                <CommandList>
                  <CommandEmpty>No apps found.</CommandEmpty>
                  <CommandGroup heading="Your Apps">
                    {allApps.map((app) => {
                      const appBusiness = app.businessId
                        ? businesses.find(b => b.id === app.businessId)
                        : null;
                      return (
                        <CommandItem
                          key={app.id}
                          value={app.name}
                          onSelect={() => {
                            setSelectedApp({
                              id: app.id,
                              name: app.name,
                              color: app.color,
                              businessId: app.businessId,
                            });
                            setOpen(false);
                            toast.success(`Selected ${app.name}`);
                          }}
                          className="flex items-center gap-3 py-2.5 cursor-pointer"
                        >
                          <div
                            className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                            style={{ backgroundColor: app.color || 'hsl(var(--primary))' }}
                          >
                            <Sparkles className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="font-medium text-sm truncate">{app.name}</span>
                            {appBusiness && (
                              <span className="text-xs text-muted-foreground truncate">
                                {appBusiness.companyName}
                              </span>
                            )}
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => {
                        setOpen(false);
                        window.location.href = '/app-hub';
                      }}
                      className="cursor-pointer"
                    >
                      <Building2 className="h-4 w-4 mr-2" />
                      Browse All Apps
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </>
      )}

      <div className="ml-auto flex items-center gap-1 md:gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
