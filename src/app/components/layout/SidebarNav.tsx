import {
  Settings,
  HelpCircle,
  LogOut,
  UserCircle,
} from 'lucide-react';
import { ICONS } from '../../lib/icon-registry';
import { Link, useLocation } from 'react-router';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '../ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { useSelectedApp } from '../../contexts/SelectedAppContext';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { toast } from 'sonner';

const navigation = [
  // Primary Workflow
  { label: 'Dashboard', href: '/', icon: ICONS.nav.HOME, group: 'primary' },
  { label: 'Quick Capture', href: '/capture', icon: ICONS.nav.SPARKLES, group: 'primary' },
  { label: 'App Incubator', href: '/app-incubator', icon: ICONS.nav.APP_INCUBATOR, group: 'primary', badge: 'apps' },
  { label: 'Business DNA', href: '/app-hub', icon: ICONS.nav.BUSINESS_DNA, group: 'primary' },
  
  // Resources & Monitoring
  { label: 'Assets', href: '/assets', icon: ICONS.nav.ASSETS, group: 'secondary' },
  { label: 'Health', href: '/health', icon: ICONS.nav.HEALTH, group: 'secondary', badge: 'health' },
  { label: 'Export', href: '/export', icon: ICONS.nav.EXPORT, group: 'secondary' },
  
  // System
  { label: 'Tasks', href: '/tasks', icon: ICONS.nav.TASKS, group: 'tertiary', badge: 'tasks' },
];

export function SidebarNav() {
  const location = useLocation();
  const { selectedApp, setSelectedApp, canUndo, undoSelection, previousApp } = useSelectedApp();
  const { appConcepts, tasks } = useData();
  const { user } = useAuth();

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const displayEmail = user?.email || '';

  // Calculate badges
  const activeApps = appConcepts.filter(app =>
    ['idea', 'brainstorming', 'prototyping'].includes(app.status)
  ).length;
  
  const pendingTasks = tasks.filter(task =>
    task.status === 'todo' || task.status === 'in-progress'
  ).length;
  
  const healthScore = 87; // This would come from actual health calculation

  const getBadgeContent = (badgeType?: string) => {
    switch (badgeType) {
      case 'apps':
        return activeApps > 0 ? activeApps : null;
      case 'tasks':
        return pendingTasks > 0 ? pendingTasks : null;
      case 'health':
        return null; // Show dot indicator instead
      default:
        return null;
    }
  };

  const getHealthColor = () => {
    if (healthScore >= 90) return 'bg-green-500';
    if (healthScore >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Sidebar>
      {/* Branding Header */}
      <SidebarHeader className="border-b p-4">
        <Link to="/" className="flex items-center gap-2 group transition-all">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <ICONS.nav.WORKSPACE className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-headline font-semibold">Content Hub</span>
            <span className="text-xs text-muted-foreground">Business Platform</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {/* Navigation Groups */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item, index) => {
                const prevGroup = index > 0 ? navigation[index - 1].group : null;
                const showSpacer = prevGroup && prevGroup !== item.group;
                const badgeContent = getBadgeContent(item.badge);
                
                // Dynamic href for Workspace based on selected app
                const dynamicHref = item.label === 'Workspace' && selectedApp 
                  ? `/workspace/${selectedApp.id}` 
                  : item.href;
                
                return (
                  <div key={item.href}>
                    {showSpacer && <div className="h-3" />}
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === dynamicHref || (dynamicHref !== '/' && location.pathname.startsWith(dynamicHref))}
                        className="transition-all duration-200 hover:translate-x-0.5"
                      >
                        <Link to={dynamicHref}>
                          <item.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                          <span>{item.label}</span>
                          {item.badge === 'health' && (
                            <div className={`ml-auto h-2 w-2 rounded-full ${getHealthColor()} animate-pulse`} />
                          )}
                          {badgeContent && (
                            <Badge variant="secondary" className="ml-auto h-5 min-w-5 px-1.5 text-xs">
                              {badgeContent}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </div>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full transition-colors">
                  <UserCircle className="h-4 w-4" />
                  <span>{displayName}</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{displayName}</p>
                  <p className="text-xs text-muted-foreground">{displayEmail}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/help">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await signOut(auth);
                    toast.success('Signed out');
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}