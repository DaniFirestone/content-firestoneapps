import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router';
import {
  Building2,
  Search,
  PlusCircle,
  Trash2,
  Package,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ExternalLink,
  Megaphone,
  Target,
  Sparkles,
  MessageSquareQuote,
  Edit,
  MoreVertical,
  Download,
  Inbox,
  Pin,
  Palette,
} from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription } from '../ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { mockBusinesses } from '../../lib/mock-data';
import { mockFirestoneApps } from '../../lib/mock-apps-new';
import type { AppConcept } from '../../lib/mock-data';
import { toast } from 'sonner';
import { AppIcon } from '../common/AppIcon';
import { useSelectedApp } from '../../contexts/SelectedAppContext';

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'published':
        return 'default';
      case 'brainstorming':
      case 'prototyping':
        return 'secondary';
      case 'archived':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Badge variant={getStatusVariant(status)} className="text-xs capitalize">
      {status}
    </Badge>
  );
}

export function AppHubClient() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedHubs, setExpandedHubs] = useState<Set<string>>(new Set());
  const [hubToDelete, setHubToDelete] = useState<string | null>(null);
  const [cleanupApps, setCleanupApps] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Use selected app context
  const { selectedApp, setSelectedApp } = useSelectedApp();

  // Mock data - in real app these would be from hooks
  const hubs = mockBusinesses;
  const allApps = mockFirestoneApps;
  const hubsLoading = false;
  const appsLoading = false;
  const hubsError = null;

  const displayedHubs = useMemo(() => {
    return hubs.filter((hub) => {
      if (searchTerm === '') return true;
      return (
        hub.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hub.tagline?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [hubs, searchTerm]);

  const appsByDNA = useMemo(() => {
    if (!allApps) return new Map<string, AppConcept[]>();
    return allApps.reduce((acc, app) => {
      // Group apps by businessId (not businessDNAId since we're not using DNA system yet)
      if (app.businessId) {
        if (!acc.has(app.businessId)) {
          acc.set(app.businessId, []);
        }
        acc.get(app.businessId)?.push(app);
      }
      return acc;
    }, new Map<string, AppConcept[]>());
  }, [allApps]);

  const toggleExpanded = useCallback((hubId: string) => {
    setExpandedHubs((prev) => {
      const next = new Set(prev);
      if (next.has(hubId)) {
        next.delete(hubId);
      } else {
        next.add(hubId);
      }
      return next;
    });
  }, []);

  const handleDeleteConfirm = () => {
    if (!hubToDelete) return;
    setIsDeleting(true);
    
    // Mock deletion - in real app this would be a mutation
    setTimeout(() => {
      console.log(`Deleting hub ${hubToDelete} with cleanupApps: ${cleanupApps}`);
      setHubToDelete(null);
      setCleanupApps(false);
      setIsDeleting(false);
    }, 1000);
  };

  // Calculate hub usage (how many apps are associated)
  const getHubUsage = (hubId: string) => {
    const apps = appsByDNA.get(hubId) || [];
    return {
      inUse: apps.length > 0,
      appCount: apps.length,
    };
  };

  if (hubsLoading || appsLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[450px] w-full rounded-xl" />
          <Skeleton className="h-[450px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (hubsError) {
    console.error('Business Hub Error:', hubsError);
    return (
      <div className="space-y-4">
        <Alert variant="destructive" className="rounded-xl border-2">
          <AlertDescription>
            Failed to load Business Hub data: {hubsError instanceof Error ? hubsError.message : 'Unknown error'}
          </AlertDescription>
        </Alert>
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground mb-4">You can still create a new business to get started.</p>
          <Button asChild size="lg" className="rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <Link to="/business-hub/create">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create First Business
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <Card className="border-2 shadow-sm hover:shadow-md transition-shadow rounded-xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4">
              <div className="relative w-full sm:w-auto sm:flex-grow lg:flex-grow-0">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search businesses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 w-full sm:w-96 rounded-xl border-2 focus:ring-2 transition-all"
                />
              </div>

              <div className="flex-grow" />

              <div className="flex items-center gap-3">
                <Button 
                  variant="default" 
                  size="lg" 
                  asChild 
                  className="rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105"
                >
                  <Link to="/business-hub/create">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    New Business
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {displayedHubs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayedHubs.map((hub) => {
              const associatedApps = appsByDNA.get(hub.id) || [];
              const colors = [
                hub.colorPalette?.primary?.hex,
                hub.colorPalette?.secondary?.hex,
                hub.colorPalette?.accent?.hex,
                ...(hub.colorPalette?.customColors?.map((c) => c.hex) || []),
              ].filter(Boolean) as string[];
              const brandBarStyle =
                colors.length > 0 ? { background: `linear-gradient(90deg, ${colors.join(', ')})` } : {};
              const cardBackgroundStyle = hub.colorPalette?.background?.hex
                ? { backgroundColor: hub.colorPalette.background.hex }
                : {};

              return (
                <Card
                  key={hub.id}
                  className="overflow-hidden flex flex-col transition-all duration-300 border-2 shadow-lg hover:shadow-2xl hover:-translate-y-1 rounded-2xl group"
                  style={cardBackgroundStyle}
                >
                  <div className="h-3 w-full" style={brandBarStyle} />
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <CardTitle
                          className="flex items-center gap-3 text-2xl mb-2 group-hover:scale-[1.02] transition-transform"
                          style={hub.colorPalette?.primary?.hex ? { color: hub.colorPalette.primary.hex } : {}}
                        >
                          <div 
                            className="p-2.5 rounded-xl shadow-md" 
                            style={hub.colorPalette?.primary?.hex ? { 
                              backgroundColor: `${hub.colorPalette.primary.hex}15`,
                              color: hub.colorPalette.primary.hex 
                            } : {}}
                          >
                            <Building2 className="h-6 w-6" />
                          </div>
                          <span>{hub.companyName}</span>
                        </CardTitle>
                        <CardDescription className="text-base pl-[52px]">{hub.tagline}</CardDescription>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => toggleExpanded(hub.id)}
                          className="rounded-xl hover:scale-110 transition-transform border-2"
                        >
                          {expandedHubs.has(hub.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                        
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="rounded-xl hover:scale-110 transition-transform border-2"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl">
                            <DropdownMenuItem asChild>
                              <Link to={`/business-hub/${hub.id}/edit`} className="cursor-pointer flex items-center">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Business
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/style-guide/${hub.id}`} className="cursor-pointer flex items-center">
                                <Palette className="mr-2 h-4 w-4" />
                                Style Guide
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => toast.success('Export feature coming soon!')}
                              className="cursor-pointer"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Export Data
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => setHubToDelete(hub.id)}
                              className="text-destructive focus:text-destructive cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Business
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5 flex-grow px-6">
                    {hub.missionStatement && (
                      <p className="text-sm text-muted-foreground italic line-clamp-3 leading-relaxed border-l-2 pl-4" style={hub.colorPalette?.primary?.hex ? { borderColor: hub.colorPalette.primary.hex } : {}}>
                        {hub.missionStatement}
                      </p>
                    )}

                    {colors.length > 0 && (
                      <div className="p-4 rounded-xl bg-secondary/30 border">
                        <div className="flex items-center gap-2 mb-3">
                          <Palette className="h-4 w-4 text-muted-foreground" />
                          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Colors</h4>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                          {colors.map((color, idx) => (
                            <TooltipProvider key={idx}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div
                                    className="w-10 h-10 rounded-xl border-2 border-white shadow-lg cursor-pointer hover:scale-125 transition-transform"
                                    style={{ backgroundColor: color }}
                                  />
                                </TooltipTrigger>
                                <TooltipContent className="rounded-lg">
                                  <p className="font-mono text-xs">{color}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                      </div>
                    )}
                    {expandedHubs.has(hub.id) && (
                      <div className="space-y-5 pt-4 border-t-2">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/20 border">
                          <div className="flex items-center gap-2 mb-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Mission</h4>
                          </div>
                          <p className="text-sm leading-relaxed">
                            {hub.missionStatement || (
                              <span className="italic text-muted-foreground/60">Not defined</span>
                            )}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/20 border">
                          <div className="flex items-center gap-2 mb-2">
                            <Megaphone className="h-4 w-4 text-muted-foreground" />
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Brand Voice</h4>
                          </div>
                          <p className="text-sm leading-relaxed">
                            {hub.brandVoice || hub.brandVoiceCustom || (
                              <span className="italic text-muted-foreground/60">Not defined</span>
                            )}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/20 border">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Target Audience</h4>
                          </div>
                          <p className="text-sm leading-relaxed">
                            {hub.targetAudience || <span className="italic text-muted-foreground/60">Not defined</span>}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/20 border">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-4 w-4 text-muted-foreground" />
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">USP</h4>
                          </div>
                          <p className="text-sm leading-relaxed">
                            {hub.uniqueSellingProposition || (
                              <span className="italic text-muted-foreground/60">Not defined</span>
                            )}
                          </p>
                        </div>

                        {hub.messagingPillars && hub.messagingPillars.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <MessageSquareQuote className="h-4 w-4 text-muted-foreground" />
                              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Pillars</h4>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                              {hub.messagingPillars.map((pillar, idx) => (
                                <div key={idx} className="p-3 rounded-xl border-2 bg-gradient-to-br from-background to-secondary/30 hover:shadow-md transition-shadow">
                                  <p className="font-semibold text-sm">{pillar.pillar || 'Untitled'}</p>
                                  {pillar.description && (
                                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{pillar.description}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="bg-gradient-to-br from-secondary/80 to-secondary/40 p-4 mt-auto border-t-2">
                    <div className="w-full">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-background/80">
                            <Package className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <h4 className="text-sm font-bold text-foreground">
                            Apps ({associatedApps.length})
                          </h4>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 rounded-lg hover:bg-background/80 transition-all hover:scale-105"
                        >
                          <PlusCircle className="mr-1.5 h-4 w-4" />
                          New App
                        </Button>
                      </div>
                      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
                        {associatedApps.length > 0 ? (
                          associatedApps.map((app: AppConcept) => {
                            const isActive = selectedApp?.id === app.id;
                            return (
                              <div key={app.id} className="relative group">
                                {/* Pin indicator for selected app */}
                                {isActive && (
                                  <div className="absolute -top-1 -right-1 z-20 bg-primary text-primary-foreground rounded-full p-1 shadow-lg animate-in zoom-in">
                                    <Pin className="h-3 w-3" />
                                  </div>
                                )}
                                <div
                                  onClick={() => {
                                    // Navigate to workspace
                                    navigate(`/workspace/${app.id}`);
                                  }}
                                  className={`p-3.5 border-2 rounded-xl cursor-pointer hover:border-primary hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col justify-between items-start gap-2.5 text-left h-full bg-gradient-to-br from-background to-secondary/30 ${
                                    isActive ? 'ring-2 ring-primary ring-offset-2' : ''
                                  }`}
                                  style={{
                                    backgroundColor: app.backgroundColor || 'var(--card)',
                                    color: app.primaryColor || 'var(--card-foreground)',
                                  }}
                                >
                                  <div className="w-full flex items-start justify-between">
                                    <AppIcon
                                      appName={app.appNameInternal}
                                      iconUrl={app.iconUrl}
                                      primaryColor={app.primaryColor}
                                      accentColor={app.accentColor}
                                      size="sm"
                                    />
                                    <StatusBadge status={app.status} />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-sm line-clamp-2 leading-tight">
                                      {app.appNamePublished || app.appNameInternal}
                                    </p>
                                  </div>
                                </div>
                                {app.status === 'published' && (
                                  <a
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                    }}
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-110 shadow-lg z-20"
                                    title="Open live app"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <div className="col-span-2 sm:col-span-3 text-center py-8 px-4 rounded-xl border-2 border-dashed bg-gradient-to-br from-secondary/20 to-secondary/5">
                            <div className="p-3 rounded-xl bg-secondary/50 w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                              <Inbox className="h-7 w-7 text-muted-foreground" />
                            </div>
                            <h4 className="font-semibold text-sm mb-1">No Apps Yet</h4>
                            <p className="text-xs text-muted-foreground mb-3">
                              Create your first app for {hub.companyName}
                            </p>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="rounded-lg hover:scale-105 transition-transform"
                            >
                              <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
                              Create App
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-gradient-to-br from-card to-secondary/20 rounded-2xl border-2 shadow-lg">
            <div className="p-6 rounded-2xl bg-secondary/50 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Building2 className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Businesses Found</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              {searchTerm ? 'Try adjusting your search.' : 'Create your first business to get started.'}
            </p>
            {!searchTerm && (
              <Button asChild size="lg" className="rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <Link to="/business-hub/create">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create Business
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>

      <AlertDialog
        open={!!hubToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setHubToDelete(null);
            setCleanupApps(false);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Business Hub?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>This will permanently delete the business hub. This action cannot be undone.</p>

              {hubToDelete && getHubUsage(hubToDelete).inUse && (
                <Alert variant="destructive" className="mt-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Warning:</strong> This hub is currently being used by {getHubUsage(hubToDelete).appCount}{' '}
                    app
                    {getHubUsage(hubToDelete).appCount !== 1 ? 's' : ''}.
                    {!cleanupApps && ' Apps will have orphaned DNA references if you proceed without cleanup.'}
                  </AlertDescription>
                </Alert>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {hubToDelete && getHubUsage(hubToDelete).inUse && (
            <div className="flex items-center space-x-2 py-2">
              <Checkbox
                id="cleanup-apps"
                checked={cleanupApps}
                onCheckedChange={(checked) => setCleanupApps(checked === true)}
              />
              <Label
                htmlFor="cleanup-apps"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remove DNA references from {getHubUsage(hubToDelete).appCount} affected app
                {getHubUsage(hubToDelete).appCount !== 1 ? 's' : ''} (Recommended)
              </Label>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setHubToDelete(null);
                setCleanupApps(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Hub'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}