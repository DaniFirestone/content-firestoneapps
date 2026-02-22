import { Link, useNavigate } from 'react-router';
import { 
  Sparkles, 
  Lightbulb, 
  Layers, 
  ListTodo, 
  Activity, 
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Wrench
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Input } from '../components/ui/input';
import { spacing } from '../lib/design-tokens';
import { useSelectedApp } from '../contexts/SelectedAppContext';
import { useData } from '../contexts/DataContext';
import { ICONS } from '../lib/icon-registry';
import { useState } from 'react';
import { toast } from 'sonner';

export function DashboardPage() {
  const { selectedApp, setSelectedApp } = useSelectedApp();
  const { appConcepts, tasks } = useData();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate stats
  const activeApps = appConcepts.filter(app =>
    ['idea', 'brainstorming', 'prototyping'].includes(app.status)
  );
  const pendingTasks = tasks.filter(task =>
    task.status === 'todo' || task.status === 'in-progress'
  );
  const healthScore = 87;

  // Search filtering
  const filteredApps = searchQuery.trim()
    ? appConcepts.filter(app =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleAppClick = (app: typeof appConcepts[0], isWorkspace: boolean) => {
    if (isWorkspace) {
      setSelectedApp(app);
      navigate(`/workspace/${app.id}`);
      toast.success(`Opened ${app.name} workspace`);
    } else {
      navigate(`/app-incubator/${app.id}`);
      toast.success(`Opened ${app.name} in incubator`);
    }
    setSearchQuery('');
  };

  // Recent activity (mock)
  const recentActivity = [
    {
      id: 1,
      type: 'app',
      title: 'New app idea captured',
      subtitle: 'Task Master Pro',
      time: '2 hours ago',
      color: 'hsl(210, 100%, 50%)',
    },
    {
      id: 2,
      type: 'task',
      title: 'Task completed',
      subtitle: 'Design landing page mockups',
      time: '4 hours ago',
      color: 'hsl(142, 71%, 45%)',
    },
    {
      id: 3,
      type: 'asset',
      title: 'New asset uploaded',
      subtitle: 'Homepage wireframe v2.png',
      time: '1 day ago',
      color: 'hsl(280, 100%, 50%)',
    },
  ];

  const getHealthColor = () => {
    if (healthScore >= 90) return 'text-green-600 bg-green-50';
    if (healthScore >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="border-b bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <div className={`${spacing.page.padding} ${spacing.page.container} py-8 md:py-12`}>
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
            <div className="flex-1 w-full">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10 md:h-12 md:w-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl md:text-3xl font-headline font-bold">Welcome back!</h1>
                  <p className="text-sm md:text-base text-muted-foreground">Here's what's happening with your projects</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mt-6">
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-background/60 border">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Lightbulb className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold">{activeApps.length}</p>
                    <p className="text-xs text-muted-foreground">Active Apps</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-background/60 border">
                  <div className="p-2 rounded-lg bg-orange-50">
                    <ListTodo className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold">{pendingTasks.length}</p>
                    <p className="text-xs text-muted-foreground">Pending Tasks</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-background/60 border">
                  <div className={`p-2 rounded-lg ${getHealthColor()}`}>
                    <Activity className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold">{healthScore}%</p>
                    <p className="text-xs text-muted-foreground">Health Score</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions - Hidden on mobile, shown as a card on tablet+ */}
            <Card className="w-full lg:w-72 hidden sm:block">
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start h-10">
                  <Link to="/capture">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Quick Capture
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start h-10">
                  <Link to="/app-incubator">
                    <Lightbulb className="mr-2 h-4 w-4" />
                    App Incubator
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start h-10">
                  <Link to="/app-hub">
                    <Layers className="mr-2 h-4 w-4" />
                    App Workspaces
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${spacing.page.padding} ${spacing.page.container} py-6 md:py-8`}>
        
        {/* App Search - Prominent Feature */}
        <Card className="mb-6 border-2 border-primary/20 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">Jump to App</h2>
                <p className="text-xs text-muted-foreground">Search and open any app workspace or incubator</p>
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type app name to search... (e.g., Social Media Manager, CRM Tool)"
                className="pl-9 h-10"
              />
              
              {/* Search Results Dropdown */}
              {searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 max-h-96 overflow-auto">
                  {filteredApps.length > 0 ? (
                    <div className="p-2">
                      <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                        Found {filteredApps.length} app{filteredApps.length !== 1 ? 's' : ''}
                      </div>
                      {filteredApps.map((app) => {
                        const isProduction = app.status === 'production';
                        const isIncubating = ['idea', 'brainstorming', 'prototyping'].includes(app.status);
                        
                        return (
                          <div key={app.id} className="mb-2 last:mb-0">
                            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/50">
                              <div 
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: app.color }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{app.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{app.description}</p>
                              </div>
                              <Badge variant="outline" className="text-xs capitalize shrink-0">
                                {app.status}
                              </Badge>
                            </div>
                            
                            <div className="flex gap-2 mt-1 px-3">
                              {isProduction && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 h-8"
                                  onClick={() => handleAppClick(app, true)}
                                >
                                  <Wrench className="mr-1.5 h-3 w-3" />
                                  Open Workspace
                                </Button>
                              )}
                              {isIncubating && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 h-8"
                                  onClick={() => handleAppClick(app, false)}
                                >
                                  <Lightbulb className="mr-1.5 h-3 w-3" />
                                  Open Incubator
                                </Button>
                              )}
                              {!isProduction && !isIncubating && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 h-8"
                                  onClick={() => handleAppClick(app, false)}
                                >
                                  <Layers className="mr-1.5 h-3 w-3" />
                                  View App
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                      <Search className="h-8 w-8 mx-auto mb-3 opacity-50" />
                      <p className="font-medium mb-1">No apps found</p>
                      <p className="text-xs">Try a different search term</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {!searchQuery && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-2">Recent apps</p>
                <div className="flex flex-wrap gap-2">
                  {appConcepts.slice(0, 5).map((app) => (
                    <button
                      key={app.id}
                      onClick={() => setSearchQuery(app.name)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 hover:bg-muted transition-colors text-sm"
                    >
                      <div 
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: app.color }}
                      />
                      <span>{app.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Left Column - Active Apps & Tasks */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Active App Context */}
            {selectedApp ? (
              <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: selectedApp.color || 'hsl(var(--primary))' }}
                      />
                      <div>
                        <CardTitle className="text-base">Active Workspace</CardTitle>
                        <CardDescription>{selectedApp.name}</CardDescription>
                      </div>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/workspace/${selectedApp.id}`}>
                        Open Workspace
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">No Active Workspace</CardTitle>
                  <CardDescription>
                    Select an app from App Workspaces to get started
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/app-hub">
                      Browse Apps
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Apps in Incubation */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      Apps in Incubation
                    </CardTitle>
                    <CardDescription>Ideas and concepts in development</CardDescription>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/app-incubator">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {activeApps.length > 0 ? (
                  <div className="space-y-3">
                    {activeApps.slice(0, 4).map((app) => (
                      <Link
                        key={app.id}
                        to={`/app-incubator/${app.id}`}
                        className="flex items-center justify-between p-3 rounded-lg border hover:border-primary/50 hover:bg-accent/50 transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div 
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: app.color }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium truncate">{app.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">{app.status}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No apps in incubation. Create one to get started!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Pending Tasks */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ListTodo className="h-5 w-5 text-primary" />
                      Pending Tasks
                    </CardTitle>
                    <CardDescription>Tasks that need your attention</CardDescription>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/tasks">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {pendingTasks.length > 0 ? (
                  <div className="space-y-3">
                    {pendingTasks.slice(0, 4).map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start gap-3 p-3 rounded-lg border"
                      >
                        <div className="mt-0.5">
                          {task.status === 'in-progress' ? (
                            <Clock className="h-4 w-4 text-orange-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{task.title}</p>
                          <p className="text-xs text-muted-foreground">{task.description}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-xs capitalize">
                              {task.priority}
                            </Badge>
                            <Badge variant="secondary" className="text-xs capitalize">
                              {task.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No pending tasks. You're all caught up!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Activity & Health */}
          <div className="space-y-6">
            
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <div 
                        className="w-2 h-2 rounded-full shrink-0 mt-2"
                        style={{ backgroundColor: activity.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{activity.subtitle}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getHealthColor()}`}>
                      <span className="text-3xl font-bold">{healthScore}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">Overall Health Score</p>
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Apps Healthy</span>
                      <span className="font-medium">8/10</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tasks On Time</span>
                      <span className="font-medium">12/15</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Assets Organized</span>
                      <span className="font-medium">94%</span>
                    </div>
                  </div>

                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to="/health">
                      View Full Report
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* What's New */}
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-5 w-5 text-primary" />
                  What's New
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    <p>Dashboard overview is now live</p>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    <p>Quick app switcher in header</p>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    <p>Improved navigation structure</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}