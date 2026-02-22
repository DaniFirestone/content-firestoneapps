import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router';
import {
  Rocket,
  FileText,
  Code,
  Link as LinkIcon,
  Check,
  Settings,
  ExternalLink,
  Building2,
  Package,
  Wrench,
  CheckCircle2,
  Circle,
  MinusCircle,
  XCircle,
  Edit,
  Plus,
  Trash2,
  Calendar,
  Target,
  Sparkles,
  Database,
  Globe,
  GitBranch,
  Activity,
  AlertTriangle,
  Info,
  Filter,
  ArrowRight,
  Lightbulb,
  Zap,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  MoreVertical,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription } from '../ui/alert';
import { mockFirestoneApps } from '../../lib/mock-apps-new';
import { mockBusinesses } from '../../lib/mock-data';
import { toast } from 'sonner';
import { AppIcon } from '../common/AppIcon';
import { useSelectedApp } from '../../contexts/SelectedAppContext';

// Status Icons
const statusIcons = {
  done: <CheckCircle2 className="h-4 w-4 text-green-600" />,
  in_progress: <Circle className="h-4 w-4 text-blue-600" />,
  todo: <Circle className="h-4 w-4 text-muted-foreground" />,
  parked: <MinusCircle className="h-4 w-4 text-yellow-600" />,
};

export function WorkspaceClient() {
  const { id } = useParams();
  const { selectedApp } = useSelectedApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading] = useState(false);
  const [taskFilter, setTaskFilter] = useState<'all' | 'todo' | 'in_progress' | 'done' | 'high_priority'>('all');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [sessionBannerExpanded, setSessionBannerExpanded] = useState(true);

  // Get the app - URL param takes priority, then selected app, then fallback
  const app = useMemo(() => {
    if (id) {
      return mockFirestoneApps.find((a) => a.id === id);
    }
    if (selectedApp) {
      return selectedApp;
    }
    return null;
  }, [id, selectedApp]);

  // Get associated business
  const business = useMemo(() => {
    return app?.businessId ? mockBusinesses.find((b) => b.id === app.businessId) : null;
  }, [app]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-4 md:grid-cols-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertDescription>No app found. Please select an app from the App Hub.</AlertDescription>
        </Alert>
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-lg font-semibold mb-1">No App Selected</h3>
          <p className="text-sm text-muted-foreground mb-4">Select an app to view its workspace.</p>
          <Button asChild>
            <Link to="/app-hub">Go to App Hub</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Calculate stats
  const completedTasks = app.tasks?.filter((t) => t.status === 'done').length || 0;
  const totalTasks = app.tasks?.length || 0;
  const enabledFeatures = app.enabledFeatures?.filter((f) => f.enabled).length || 0;
  const totalFeatures = app.enabledFeatures?.length || 0;
  const highPriorityTasks = app.tasks?.filter((t) => t.status !== 'done' && t.priority === 'high').length || 0;
  const inProgressTasks = app.tasks?.filter((t) => t.status === 'in_progress').length || 0;

  // Filter tasks based on selected filter
  const filteredTasks = useMemo(() => {
    if (!app.tasks) return [];
    switch (taskFilter) {
      case 'todo':
        return app.tasks.filter((t) => t.status === 'todo');
      case 'in_progress':
        return app.tasks.filter((t) => t.status === 'in_progress');
      case 'done':
        return app.tasks.filter((t) => t.status === 'done');
      case 'high_priority':
        return app.tasks.filter((t) => t.priority === 'high' && t.status !== 'done');
      default:
        return app.tasks;
    }
  }, [app.tasks, taskFilter]);

  // Smart insights based on app state
  const insights = useMemo(() => {
    const insights: Array<{ type: 'warning' | 'info' | 'success'; message: string; action?: () => void }> = [];

    // Check for high priority tasks
    if (highPriorityTasks > 0) {
      insights.push({
        type: 'warning',
        message: `${highPriorityTasks} high priority ${highPriorityTasks === 1 ? 'task needs' : 'tasks need'} attention`,
        action: () => {
          setActiveTab('development');
          setTaskFilter('high_priority');
        },
      });
    }

    // Check for stalled progress
    if (inProgressTasks === 0 && totalTasks > completedTasks) {
      insights.push({
        type: 'info',
        message: 'No tasks in progress - time to start working?',
        action: () => setActiveTab('development'),
      });
    }

    // Check for completion milestone
    if (completedTasks > 0 && completedTasks === totalTasks && totalTasks > 0) {
      insights.push({
        type: 'success',
        message: 'All tasks complete! Ready for next phase?',
      });
    }

    // Check for low progress with many tasks
    if ((app.progress ?? 0) < 30 && totalTasks > 5) {
      insights.push({
        type: 'info',
        message: `${totalTasks} tasks but only ${app.progress}% progress - break down tasks?`,
        action: () => setActiveTab('development'),
      });
    }

    return insights;
  }, [app.progress, completedTasks, totalTasks, highPriorityTasks, inProgressTasks]);

  // App completeness score
  const completeness = useMemo(() => {
    let score = 0;
    let total = 0;

    // Core info
    if (app.problemStatement) score++;
    total++;
    if (app.solutionStatement) score++;
    total++;
    if (app.mainPrompt) score++;
    total++;

    // Development
    if (totalTasks > 0) score++;
    total++;
    if (totalFeatures > 0) score++;
    total++;

    // Technical
    if (app.techStack && app.techStack.length > 0) score++;
    total++;

    return { score, total, percentage: Math.round((score / total) * 100) };
  }, [app, totalTasks, totalFeatures]);

  return (
    <>
      {/* App Header - Minimal */}
      <div className="mb-6 pb-4 border-b">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <AppIcon
              appName={app.appNameInternal}
              iconUrl={app.iconUrl}
              primaryColor={app.primaryColor}
              accentColor={app.accentColor}
              size="md"
            />
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-semibold truncate">
                {app.appNamePublished || app.appNameInternal}
              </h1>
              {app.appNamePublished && app.appNameInternal !== app.appNamePublished && (
                <p className="text-xs text-muted-foreground">Internal: {app.appNameInternal}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="secondary" className="capitalize">{app.status}</Badge>
            {app.isFocused && <Badge variant="outline">Focused</Badge>}
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {app.longDescription || app.description ? (
          <p className="text-sm text-muted-foreground">{app.longDescription || app.description}</p>
        ) : null}
        
        {business && (
          <div className="mt-2 flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
            <Link
              to={`/business-hub/${business.id}`}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {business.companyName}
            </Link>
          </div>
        )}
      </div>

      {/* Stats Grid - More Actionable */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        {/* Progress */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('development')}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{app.progress ?? 0}%</div>
            <Progress value={app.progress ?? 0} className="mt-2 h-2" />
          </CardContent>
        </Card>

        {/* Active Work */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('development')}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              Active Work
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {inProgressTasks === 1 ? 'task in progress' : 'tasks in progress'}
            </p>
          </CardContent>
        </Card>

        {/* High Priority */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('development')}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-orange-600" />
              High Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highPriorityTasks}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {highPriorityTasks === 1 ? 'urgent task' : 'urgent tasks'}
            </p>
          </CardContent>
        </Card>

        {/* Completion */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('development')}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedTasks}/{totalTasks}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">tasks completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Session Context Banner */}
      {app.sessionState && (
        <Alert className="mb-6" style={app.primaryColor ? { borderColor: `${app.primaryColor}40` } : {}}>
          <Activity className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold mb-1">Session Context</p>
            <p className="text-sm">{app.sessionState.aiSummary || app.lastSessionContext}</p>
            {app.sessionState.userNote && (
              <p className="text-sm text-muted-foreground mt-1">Note: {app.sessionState.userNote}</p>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Smart Insights */}
      {insights.length > 0 && (
        <div className="mb-6 space-y-2">
          {insights.map((insight, index) => (
            <Alert
              key={index}
              variant={insight.type === 'warning' ? 'destructive' : 'default'}
              className={insight.action ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
              onClick={insight.action}
            >
              {insight.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
              {insight.type === 'info' && <Info className="h-4 w-4" />}
              {insight.type === 'success' && <CheckCircle2 className="h-4 w-4" />}
              <AlertDescription className="flex items-center justify-between">
                <span>{insight.message}</span>
                {insight.action && <ArrowRight className="h-4 w-4 ml-2" />}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            <FileText className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="development">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Development
          </TabsTrigger>
          <TabsTrigger value="technical">
            <Code className="mr-2 h-4 w-4" />
            Technical
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Problem & Solution */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Problem Statement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">
                  {app.problemStatement || (
                    <span className="italic text-muted-foreground">Not defined yet</span>
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Solution Statement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">
                  {app.solutionStatement || (
                    <span className="italic text-muted-foreground">Not defined yet</span>
                  )}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Prompt */}
          {app.mainPrompt && (
            <Card>
              <CardHeader>
                <CardTitle>Main Prompt</CardTitle>
                <CardDescription>The core description and purpose of your app</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea value={app.mainPrompt} readOnly rows={4} className="resize-none" />
                <Button className="mt-3" variant="outline" size="sm">
                  <Edit className="mr-2 h-3.5 w-3.5" />
                  Edit Prompt
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quick Links */}
          {((app.developmentUrl || app.stagingUrl || app.firebaseConsoleLink) || (app.links && app.links.length > 0)) && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
                <CardDescription>Important links and resources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Environment Links */}
                {(app.developmentUrl || app.stagingUrl || app.firebaseConsoleLink) && (
                  <div>
                    <Label className="text-xs font-medium mb-2 block">Environments</Label>
                    <div className="flex flex-wrap gap-2">
                      {app.developmentUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={app.developmentUrl} target="_blank" rel="noopener noreferrer">
                            <Globe className="mr-2 h-3.5 w-3.5" />
                            Dev
                          </a>
                        </Button>
                      )}
                      {app.stagingUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={app.stagingUrl} target="_blank" rel="noopener noreferrer">
                            <GitBranch className="mr-2 h-3.5 w-3.5" />
                            Staging
                          </a>
                        </Button>
                      )}
                      {app.firebaseConsoleLink && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={app.firebaseConsoleLink} target="_blank" rel="noopener noreferrer">
                            <Database className="mr-2 h-3.5 w-3.5" />
                            Firebase
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Custom Links */}
                {app.links && app.links.length > 0 && (
                  <div>
                    <Label className="text-xs font-medium mb-2 block">Resources</Label>
                    <div className="space-y-2">
                      {app.links.map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-lg border p-3 transition-colors hover:bg-accent group"
                        >
                          <LinkIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="flex-1 font-medium text-sm">{link.title}</span>
                          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                <Button className="mt-2" variant="ghost" size="sm">
                  <Plus className="mr-2 h-3.5 w-3.5" />
                  Add Link
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Business DNA Context */}
          {business && app.usesBusinessDNA && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Business DNA Context
                </CardTitle>
                <CardDescription>Linked to {business.companyName}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="mb-1 text-sm font-medium">Mission</h4>
                  <p className="text-sm text-muted-foreground">{business.missionStatement}</p>
                </div>
                <div>
                  <h4 className="mb-1 text-sm font-medium">Brand Voice</h4>
                  <p className="text-sm text-muted-foreground">{business.brandVoice}</p>
                </div>
                <div>
                  <h4 className="mb-1 text-sm font-medium">Target Audience</h4>
                  <p className="text-sm text-muted-foreground">{business.targetAudience}</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/business-hub/${business.id}`}>View Full DNA</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Development Tab - Combined Tasks & Features */}
        <TabsContent value="development" className="space-y-6">
          {/* Tasks */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tasks</CardTitle>
                  <CardDescription>
                    {taskFilter === 'all'
                      ? `${completedTasks} of ${totalTasks} completed`
                      : `Showing ${filteredTasks.length} ${taskFilter.replace('_', ' ')} ${
                          filteredTasks.length === 1 ? 'task' : 'tasks'
                        }`}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    onClick={() => setTaskFilter('all')}
                  >
                    <Filter className="h-4 w-4" />
                    {taskFilter !== 'all' && <Badge variant="secondary" className="text-xs">{filteredTasks.length}</Badge>}
                  </Button>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                  </Button>
                </div>
              </div>
              
              {/* Quick Filters */}
              {app.tasks && app.tasks.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-3">
                  <Button
                    variant={taskFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTaskFilter('all')}
                  >
                    All ({totalTasks})
                  </Button>
                  <Button
                    variant={taskFilter === 'in_progress' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTaskFilter('in_progress')}
                  >
                    <Activity className="mr-1.5 h-3.5 w-3.5" />
                    In Progress ({inProgressTasks})
                  </Button>
                  <Button
                    variant={taskFilter === 'high_priority' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTaskFilter('high_priority')}
                  >
                    <Target className="mr-1.5 h-3.5 w-3.5" />
                    High Priority ({highPriorityTasks})
                  </Button>
                  <Button
                    variant={taskFilter === 'todo' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTaskFilter('todo')}
                  >
                    <Circle className="mr-1.5 h-3.5 w-3.5" />
                    To Do ({app.tasks.filter((t) => t.status === 'todo').length})
                  </Button>
                  <Button
                    variant={taskFilter === 'done' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTaskFilter('done')}
                  >
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                    Done ({completedTasks})
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {filteredTasks.length > 0 ? (
                <div className="space-y-3">
                  {filteredTasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-3 rounded-lg border p-4 group hover:shadow-sm transition-shadow">
                      <div className="mt-0.5">{statusIcons[task.status as keyof typeof statusIcons]}</div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{task.title}</h4>
                        {task.notes && <p className="mt-1 text-xs text-muted-foreground">{task.notes}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={task.priority === 'high' ? 'default' : 'secondary'} className="text-xs">
                          {task.priority}
                        </Badge>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => toast.success('Task marked as done')}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => toast.info('Edit task')}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : app.tasks && app.tasks.length > 0 ? (
                <div className="text-center py-8">
                  <Filter className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">
                    No {taskFilter.replace('_', ' ')} tasks
                  </p>
                  <Button size="sm" variant="outline" onClick={() => setTaskFilter('all')}>
                    Show All Tasks
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">No tasks yet</p>
                  <Button size="sm" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Task
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Features</CardTitle>
                  <CardDescription>
                    {enabledFeatures} of {totalFeatures} enabled
                  </CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Feature
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {app.enabledFeatures && app.enabledFeatures.length > 0 ? (
                <div className="space-y-3">
                  {app.enabledFeatures.map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-start justify-between gap-4 rounded-lg border p-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{feature.featureName}</h4>
                          {feature.excluded && (
                            <Badge variant="outline" className="text-xs">
                              Excluded
                            </Badge>
                          )}
                        </div>
                        {feature.notes && <p className="mt-1 text-xs text-muted-foreground">{feature.notes}</p>}
                        {feature.enabledAt && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Enabled: {new Date(feature.enabledAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Switch
                        checked={feature.enabled}
                        onCheckedChange={() => {
                          toast.success(`Feature ${feature.enabled ? 'disabled' : 'enabled'}`);
                        }}
                        disabled={feature.excluded}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">No features yet</p>
                  <Button size="sm" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Feature
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Technical Tab */}
        <TabsContent value="technical" className="space-y-6">
          {/* Tech Stack */}
          <Card>
            <CardHeader>
              <CardTitle>Technology Stack</CardTitle>
              <CardDescription>Technologies and frameworks</CardDescription>
            </CardHeader>
            <CardContent>
              {app.techStack && app.techStack.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {app.techStack.map((tech, index) => (
                    <Badge key={index} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No tech stack defined</p>
              )}
              <Button className="mt-4" variant="outline" size="sm">
                <Edit className="mr-2 h-3.5 w-3.5" />
                Edit Stack
              </Button>
            </CardContent>
          </Card>

          {/* Infrastructure */}
          {(app.firebaseConsoleLink || app.googleCloudProjectId) && (
            <Card>
              <CardHeader>
                <CardTitle>Infrastructure</CardTitle>
                <CardDescription>Cloud and hosting configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {app.googleCloudProjectId && (
                  <div>
                    <Label className="text-xs text-muted-foreground">GCP Project ID</Label>
                    <p className="mt-1 text-sm font-mono">{app.googleCloudProjectId}</p>
                  </div>
                )}
                {app.googleCloudProjectName && (
                  <div>
                    <Label className="text-xs text-muted-foreground">GCP Project Name</Label>
                    <p className="mt-1 text-sm font-medium">{app.googleCloudProjectName}</p>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  {app.firebaseConsoleLink && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={app.firebaseConsoleLink} target="_blank" rel="noopener noreferrer">
                        <Database className="mr-2 h-3.5 w-3.5" />
                        Console
                      </a>
                    </Button>
                  )}
                  {app.firebaseStudioLink && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={app.firebaseStudioLink} target="_blank" rel="noopener noreferrer">
                        <Wrench className="mr-2 h-3.5 w-3.5" />
                        Studio
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Project Metadata</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-xs text-muted-foreground">Category</Label>
                <p className="mt-1 text-sm font-medium">{app.category || 'Uncategorized'}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Phase</Label>
                <p className="mt-1 text-sm font-medium capitalize">{app.phase}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Chrome Profile</Label>
                <p className="mt-1 text-sm font-medium">{app.chromeProfile || 'Not set'}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">GCP Project</Label>
                <p className="mt-1 text-sm font-medium">{app.googleCloudProjectName || 'Not set'}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Created</Label>
                <p className="mt-1 text-sm font-medium">
                  {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Last Updated</Label>
                <p className="mt-1 text-sm font-medium">
                  {app.updatedAt ? new Date(app.updatedAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Validation Checkpoints */}
          {app.validationCheckpoints && app.validationCheckpoints.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Validation Checkpoints</CardTitle>
                <CardDescription>Milestones and validation stages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {app.validationCheckpoints.map((checkpoint, index) => (
                    <Badge key={index} variant="outline" className="capitalize">
                      {checkpoint}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Key Questions */}
          {app.keyQuestions && app.keyQuestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Key Questions</CardTitle>
                <CardDescription>Critical questions and answers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {app.keyQuestions.map((q, index) => (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      <p className="text-sm font-medium">{q.question}</p>
                      {q.answer ? (
                        <p className="mt-1 text-sm text-muted-foreground">{q.answer}</p>
                      ) : (
                        <p className="mt-1 text-sm italic text-muted-foreground/60">Not answered yet</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}