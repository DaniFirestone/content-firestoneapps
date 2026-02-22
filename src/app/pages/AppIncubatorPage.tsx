import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ICONS } from '../lib/icon-registry';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../components/ui/hover-card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip';
import { toast } from 'sonner';
import { spacing } from '../lib/design-tokens';
import type { AppConcept } from '../lib/mock-data';
import { useData } from '../contexts/DataContext';
import { getStageConfig } from '../lib/stage-config';
import {
  changeConceptStage,
  duplicateConcept,
  archiveConcept,
  deleteConcept,
} from '../lib/concept-management';
import { loadCheckpoints, saveConceptCheckpoints } from '../lib/checkpoint-storage';
import { StageAdvanceDialog } from '../components/app-incubator/StageAdvanceDialog';
import { ArchiveConceptDialog } from '../components/app-incubator/ArchiveConceptDialog';
import { DeleteConceptDialog } from '../components/app-incubator/DeleteConceptDialog';
import { CheckpointActionModal } from '../components/app-incubator/CheckpointActionModal';
import { useSelectedApp } from '../contexts/SelectedAppContext';

type CheckpointState = Record<string, string[]>;

export function AppIncubatorPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [conceptCheckpoints, setConceptCheckpoints] = useState<CheckpointState>(() => loadCheckpoints());
  const [advanceDialogOpen, setAdvanceDialogOpen] = useState(false);
  const [conceptToAdvance, setConceptToAdvance] = useState<AppConcept | null>(null);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [conceptToArchive, setConceptToArchive] = useState<AppConcept | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conceptToDelete, setConceptToDelete] = useState<AppConcept | null>(null);
  const [checkpointActionModalOpen, setCheckpointActionModalOpen] = useState(false);
  const [conceptForCheckpointAction, setConceptForCheckpointAction] = useState<AppConcept | null>(null);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<any>(null);
  const { selectedApp, setSelectedApp } = useSelectedApp();
  const { appConcepts, businesses } = useData();

  // Filter to active concepts from Firestore data
  const allConcepts = appConcepts.filter(
    concept => concept.status !== 'published' && concept.status !== 'archived'
  );

  // Filter by search
  const filteredConcepts = allConcepts.filter(c =>
    c.appNameInternal.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stageOrder = ['idea', 'brainstorming', 'prototyping', 'final'];

  const getBusinessName = (businessId?: string) => {
    if (!businessId) return null;
    return businesses.find((b) => b.id === businessId)?.companyName ?? null;
  };

  // Helper to get app colors (from app or business)
  const getAppColors = (concept: AppConcept) => {
    // First check if app has its own colors
    if (concept.primaryColor && concept.secondaryColor && concept.accentColor) {
      return {
        primary: concept.primaryColor,
        secondary: concept.secondaryColor,
        accent: concept.accentColor,
        background: concept.backgroundColor,
      };
    }

    // Otherwise get from business
    if (concept.businessId) {
      const business = businesses.find((b) => b.id === concept.businessId);
      if (business?.colorPalette) {
        return {
          primary: business.colorPalette.primary.hex,
          secondary: business.colorPalette.secondary.hex,
          accent: business.colorPalette.accent.hex,
          background: business.colorPalette.background.hex,
        };
      }
    }

    return null;
  };

  // Find recommended focus
  const getRecommendedFocus = (): AppConcept | null => {
    // Prioritize near completion, then recently updated
    const nearCompletion = filteredConcepts.find(c => {
      const config = getStageConfig(c.status);
      if (!config) return false;
      const checkpoints = conceptCheckpoints[c.id] || [];
      const total = config.validationCheckpoints.length;
      return total > 0 && checkpoints.length >= total - 1;
    });
    if (nearCompletion) return nearCompletion;

    return filteredConcepts[0] || null;
  };

  const recommendedConcept = getRecommendedFocus();

  const getDaysSinceUpdate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const toggleCheckpoint = (conceptId: string, checkpointId: string) => {
    setConceptCheckpoints(prev => {
      const currentCheckpoints = prev[conceptId] || [];
      const newCheckpoints = currentCheckpoints.includes(checkpointId)
        ? currentCheckpoints.filter(id => id !== checkpointId)
        : [...currentCheckpoints, checkpointId];
      
      // Persist immediately
      saveConceptCheckpoints(conceptId, newCheckpoints);
      
      // Show visual feedback
      const isCompleting = !currentCheckpoints.includes(checkpointId);
      if (isCompleting) {
        toast.success('Checkpoint completed! ✓', {
          description: 'Progress saved',
          duration: 2000,
        });
      } else {
        toast.info('Checkpoint unmarked');
      }
      
      return {
        ...prev,
        [conceptId]: newCheckpoints,
      };
    });
  };

  const getStageIcon = (stage: string) => {
    const config = getStageConfig(stage);
    if (!config) return <ICONS.status.UNCHECKED className="h-5 w-5" />;
    const Icon = config.icon;
    return <Icon className="h-5 w-5" />;
  };

  return (
    <div className={`${spacing.page.padding} ${spacing.page.container}`}>
      <PageHeader
        icon={ICONS.nav.APP_INCUBATOR}
        title="App Incubator"
        subtitle="Guide your concepts from idea to launch"
        actions={
          <Button asChild>
            <Link to="/quick-capture">
              <ICONS.action.ADD className="mr-2 h-4 w-4" />
              New Concept
            </Link>
          </Button>
        }
      />

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <ICONS.ui.SEARCH className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* All Concepts Grid - No Stage Grouping */}
      {filteredConcepts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredConcepts.map((concept) => {
            const config = getStageConfig(concept.status);
            if (!config) return null;

            const businessName = getBusinessName(concept.businessId);
            const checkpoints = conceptCheckpoints[concept.id] || [];
            const totalCheckpoints = config.validationCheckpoints.length;
            const daysSince = getDaysSinceUpdate(concept.updatedAt);
            
            const isStale = daysSince > 7;
            const isBlocked = (concept.blockers?.length || 0) > 0;
            const colors = getAppColors(concept);

            const currentStageIndex = stageOrder.findIndex(s => s === concept.status);
            const isReadyToAdvance = checkpoints.length === totalCheckpoints && currentStageIndex < stageOrder.length - 1;

            const StageIcon = config.icon;
            const isActiveApp = selectedApp?.id === concept.id;

            return (
              <Card 
                key={concept.id} 
                className="group hover:shadow-lg transition-all duration-300 overflow-hidden relative border-2"
                style={isActiveApp ? {
                  borderColor: colors?.primary || 'hsl(var(--primary))',
                } : {}}
              >
                {/* Header Section */}
                <CardHeader className="pb-4 space-y-4">
                  {/* Top Bar: Icon + Title + Menu */}
                  <div className="flex items-start gap-3">
                    {/* App Icon */}
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm"
                      style={colors ? {
                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                      } : {
                        background: 'hsl(var(--primary))',
                      }}
                    >
                      {concept.appNameInternal.charAt(0).toUpperCase()}
                    </div>

                    {/* Name + Business */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base leading-tight mb-1">
                        {concept.appNameInternal}
                      </h3>
                      {businessName && (
                        <p className="text-xs text-muted-foreground">{businessName}</p>
                      )}
                    </div>

                    {/* Quick Actions Menu */}
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ICONS.ui.MORE className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => {
                          setSelectedApp({
                            id: concept.id,
                            name: concept.appNameInternal,
                            color: colors?.primary,
                          });
                          toast.success(`${concept.appNameInternal} set as active app`);
                        }}>
                          <ICONS.action.PIN className="mr-2 h-4 w-4" />
                          {isActiveApp ? 'Active App' : 'Set as Active'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to={`/app-incubator/${concept.id}`}>
                            <ICONS.action.EDIT className="mr-2 h-4 w-4" />
                            Edit Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/style-guide/${concept.id}?type=app`}>
                            <ICONS.content.PALETTE className="mr-2 h-4 w-4" />
                            Style Guide
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={async () => {
                          const duplicated = await duplicateConcept(concept);
                          toast.success(`Created copy: ${duplicated.appNameInternal}`);
                          setTimeout(() => window.location.reload(), 100);
                        }}>
                          <ICONS.action.COPY className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                          setConceptToArchive(concept);
                          setArchiveDialogOpen(true);
                        }}>
                          <ICONS.action.ARCHIVE className="mr-2 h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setConceptToDelete(concept);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <ICONS.action.DELETE className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Stage + Status Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <StageIcon className="h-3 w-3" />
                      {config.label}
                    </Badge>
                    
                    {isBlocked && (
                      <Badge variant="destructive" className="text-xs">
                        Blocked
                      </Badge>
                    )}
                    {!isBlocked && isReadyToAdvance && (
                      <Badge 
                        className="text-xs"
                        style={colors ? {
                          background: colors.accent,
                          color: 'white',
                        } : {}}
                      >
                        Ready to Advance
                      </Badge>
                    )}
                    {!isBlocked && !isReadyToAdvance && isStale && (
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        {daysSince}d ago
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {concept.description}
                  </p>
                </CardHeader>

                {/* Checkpoints Section */}
                <CardContent className="pt-0 pb-6">
                  <div className="space-y-3">
                    {/* Checkpoints Header */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Progress</span>
                      <div 
                        className="text-sm font-bold"
                        style={colors && checkpoints.length > 0 ? { color: colors.accent } : {}}
                      >
                        {checkpoints.length}/{totalCheckpoints}
                      </div>
                    </div>

                    {/* Checkpoint List - CLICKABLE */}
                    <div className="space-y-2">
                      {config.validationCheckpoints.map((cp) => {
                        const isComplete = checkpoints.includes(cp.id);
                        return (
                          <button
                            key={cp.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setConceptForCheckpointAction(concept);
                              setSelectedCheckpoint(cp);
                              setCheckpointActionModalOpen(true);
                            }}
                            className="w-full flex items-center gap-3 p-2.5 rounded-lg border transition-all hover:border-primary/50 hover:bg-accent/50 active:scale-[0.98] text-left cursor-pointer"
                            style={
                              isComplete && colors
                                ? {
                                    borderColor: colors.accent + '40',
                                    backgroundColor: colors.accent + '08',
                                  }
                                : {}
                            }
                          >
                            {/* Checkbox */}
                            <div 
                              className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0"
                              style={
                                isComplete && colors
                                  ? {
                                      borderColor: colors.accent,
                                      backgroundColor: colors.accent,
                                    }
                                  : isComplete
                                  ? {
                                      borderColor: 'hsl(var(--primary))',
                                      backgroundColor: 'hsl(var(--primary))',
                                    }
                                  : {
                                      borderColor: 'hsl(var(--border))',
                                      backgroundColor: 'transparent',
                                    }
                              }
                            >
                              {isComplete && (
                                <ICONS.status.CHECKED className="h-3.5 w-3.5 text-white" />
                              )}
                            </div>

                            {/* Label */}
                            <div className="flex-1 min-w-0">
                              <p 
                                className={`text-sm font-medium ${
                                  isComplete 
                                    ? 'text-foreground' 
                                    : 'text-muted-foreground'
                                }`}
                              >
                                {cp.ctaLabel}
                              </p>
                            </div>

                            {/* Action indicator */}
                            <ICONS.ui.CHEVRON_RIGHT 
                              className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>

                {/* Footer Actions */}
                <CardFooter className="border-t bg-muted/20 flex-col gap-2 p-4">
                  {/* Primary CTA */}
                  {isReadyToAdvance ? (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConceptToAdvance(concept);
                        setAdvanceDialogOpen(true);
                      }}
                      className="w-full font-medium"
                      style={colors ? {
                        background: colors.accent,
                        color: 'white',
                      } : {}}
                    >
                      <ICONS.action.ADVANCE className="mr-2 h-4 w-4" />
                      Advance to {getStageConfig(stageOrder[currentStageIndex + 1])?.label}
                    </Button>
                  ) : (
                    <Button
                      asChild
                      variant="default"
                      className="w-full font-medium"
                      style={colors ? {
                        background: colors.primary,
                        color: 'white',
                      } : {}}
                    >
                      <Link to={`/app-incubator/${concept.id}`}>
                        <ICONS.action.EDIT className="mr-2 h-4 w-4" />
                        Continue Working
                      </Link>
                    </Button>
                  )}
                  
                  {/* Last Updated */}
                  <p className="text-xs text-muted-foreground/60 text-center w-full">
                    Updated {daysSince === 0 ? 'today' : `${daysSince}d ago`}
                  </p>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No concepts found</p>
          {searchQuery && (
            <Button variant="link" onClick={() => setSearchQuery('')}>
              Clear search
            </Button>
          )}
        </div>
      )}

      {/* Stage Advance Dialog */}
      {conceptToAdvance && (
        <StageAdvanceDialog
          open={advanceDialogOpen}
          onOpenChange={setAdvanceDialogOpen}
          currentStage={getStageConfig(conceptToAdvance.status)!}
          nextStage={getStageConfig(stageOrder[stageOrder.findIndex(s => s === conceptToAdvance.status) + 1])!}
          appName={conceptToAdvance.appNameInternal}
          completedCheckpoints={conceptCheckpoints[conceptToAdvance.id]?.length || 0}
          totalCheckpoints={getStageConfig(conceptToAdvance.status)!.validationCheckpoints.length}
          onConfirm={async () => {
            const nextStageId = stageOrder[stageOrder.findIndex(s => s === conceptToAdvance.status) + 1];
            const nextStageConfig = getStageConfig(nextStageId);

            // Actually update the stage
            await changeConceptStage(conceptToAdvance.id, nextStageId as any);
            
            // Clear checkpoints for this concept as we're moving to a new stage
            setConceptCheckpoints(prev => ({
              ...prev,
              [conceptToAdvance.id]: [],
            }));
            saveConceptCheckpoints(conceptToAdvance.id, []);
            
            toast.success(`Advanced to ${nextStageConfig?.label} stage! 🎉`, {
              description: 'Checkpoints reset for new stage',
            });
            setAdvanceDialogOpen(false);
            setConceptToAdvance(null);
            
            // Reload to show updated stage
            setTimeout(() => window.location.reload(), 600);
          }}
        />
      )}

      {/* Archive Concept Dialog */}
      {conceptToArchive && (
        <ArchiveConceptDialog
          open={archiveDialogOpen}
          onOpenChange={setArchiveDialogOpen}
          concept={conceptToArchive}
          onConfirm={async () => {
            await archiveConcept(conceptToArchive.id);
            toast.success(`Concept "${conceptToArchive.appNameInternal}" archived.`);
            setArchiveDialogOpen(false);
            setConceptToArchive(null);
          }}
        />
      )}

      {/* Delete Concept Dialog */}
      {conceptToDelete && (
        <DeleteConceptDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          concept={conceptToDelete}
          onConfirm={async () => {
            await deleteConcept(conceptToDelete.id);
            toast.success(`Concept "${conceptToDelete.appNameInternal}" deleted.`);
            setDeleteDialogOpen(false);
            setConceptToDelete(null);
          }}
        />
      )}

      {/* Checkpoint Action Modal */}
      {conceptForCheckpointAction && selectedCheckpoint && (
        <CheckpointActionModal
          open={checkpointActionModalOpen}
          onOpenChange={setCheckpointActionModalOpen}
          checkpoint={selectedCheckpoint}
          isComplete={(conceptCheckpoints[conceptForCheckpointAction.id] || []).includes(selectedCheckpoint.id)}
          onToggleComplete={() => {
            toggleCheckpoint(conceptForCheckpointAction.id, selectedCheckpoint.id);
          }}
          appName={conceptForCheckpointAction.appNameInternal}
          appColor={getAppColors(conceptForCheckpointAction)?.accent}
        />
      )}
    </div>
  );
}