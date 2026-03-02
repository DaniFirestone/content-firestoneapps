import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  PenTool,
  ChevronLeft,
  Save,
  Settings,
  CheckCircle2,
  ListTodo,
  Layers,
  AlertCircle,
  Clock,
  Upload,
  X,
  ImageIcon,
  LinkIcon,
  Plus,
  ExternalLink,
  Github,
  Figma,
  Globe,
  Flag,
  Brain,
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  FileText,
  Circle,
  Lightbulb,
  Palette,
  Sparkles,
  Eye,
  EyeOff,
  Menu,
  PartyPopper,
  Home,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { EmptyState } from '../components/ui/empty-state';
import type { AppConcept, AppTask } from '../lib/mock-data';
import { useData } from '../contexts/DataContext';
import { getStageConfig, stages } from '../lib/stage-config';
import { toast } from 'sonner';
import { changeConceptStage } from '../lib/concept-management';
import { loadCheckpoints, saveConceptCheckpoints } from '../lib/checkpoint-storage';
import { StageAdvanceDialog } from '../components/app-incubator/StageAdvanceDialog';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';

// Import new workspace components
import { PromptHistoryTimeline } from '../components/workspace/PromptHistoryTimeline';
import { TaskManagement } from '../components/workspace/TaskManagement';
import { ArchiveDialog } from '../components/workspace/ArchiveDialog';
import { BlockerTracking } from '../components/workspace/BlockerTracking';
import { StageProgressVisualization } from '../components/workspace/StageProgressVisualization';
import { DNAInheritanceIndicator } from '../components/workspace/DNAInheritanceIndicator';
import { AssetGallery } from '../components/workspace/AssetGallery';
import { SmartSuggestions } from '../components/workspace/SmartSuggestions';
import { CheckpointSuggestions } from '../components/workspace/CheckpointSuggestions';
import { BetterEmptyState } from '../components/workspace/BetterEmptyState';

// Types for new features
interface Prompt {
  id: string;
  content: string;
  notes?: string;
  timestamp: string;
}

interface Blocker {
  id: string;
  description: string;
  type: 'technical' | 'decision' | 'external' | 'motivation' | 'resources';
  status: 'active' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
  resolution?: string;
}

interface AssetProcessingStatus {
  status: 'inbox' | 'extracting-text' | 'generating-prompt' | 'ready' | 'failed';
  progress?: number;
  message?: string;
}

export function IncubationWorkspacePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { appConcepts } = useData();

  // Find the concept from Firestore data
  const concept = id ? appConcepts.find(c => c.id === id) ?? null : null;
  
  // Local state for editing (in real app, this would sync to backend)
  const [formData, setFormData] = useState<Partial<AppConcept>>(concept || {});
  
  // Load persisted checkpoints
  const allCheckpoints = loadCheckpoints();
  const [validatedCheckpoints, setValidatedCheckpoints] = useState<string[]>(
    concept?.id ? (allCheckpoints[concept.id] || []) : []
  );
  const [keyQuestions, setKeyQuestions] = useState(concept?.keyQuestions || []);
  const [nextAction, setNextAction] = useState(concept?.nextAction || '');
  
  // Idea cultivation state
  const [conceptImage, setConceptImage] = useState<string | null>(null);
  const [imageDescription, setImageDescription] = useState('');
  const [isExtractingImage, setIsExtractingImage] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<AssetProcessingStatus>({
    status: 'inbox',
  });

  // Prompt history state
  const [prompts, setPrompts] = useState<Prompt[]>([
    { id: '1', content: concept?.mainPrompt || '', notes: 'Initial prompt', timestamp: '2026-02-15T10:00:00Z' },
  ]);
  const [showAddPrompt, setShowAddPrompt] = useState(false);
  const [newPrompt, setNewPrompt] = useState({ content: '', notes: '' });

  // Links state
  const [links, setLinks] = useState(concept?.links || []);
  const [showAddLink, setShowAddLink] = useState(false);
  const [newLink, setNewLink] = useState({ title: '', url: '' });

  // Feature flags state
  const [features, setFeatures] = useState(concept?.enabledFeatures || []);

  // Archive dialog state
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [archiveData, setArchiveData] = useState({
    reason: '',
    learnings: '',
    salvageableIdeas: '',
  });

  // Stage advancement state
  const [showAdvanceDialog, setShowAdvanceDialog] = useState(false);
  const [targetStageId, setTargetStageId] = useState<string | null>(null);

  // Blockers state
  const [blockers, setBlockers] = useState<Blocker[]>(concept?.blockers || []);

  // Tasks state
  const [tasks, setTasks] = useState<AppTask[]>(concept?.tasks || []);

  // NEW: Focus mode state
  const [focusMode, setFocusMode] = useState(false);
  
  // NEW: Save status state
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // NEW: First visit / onboarding state
  const [showOnboarding, setShowOnboarding] = useState(() => {
    const visited = localStorage.getItem(`workspace-visited-${concept?.id}`);
    return !visited;
  });

  // Calculate days since last update
  const daysSinceLastUpdate = concept.updatedAt
    ? Math.floor(
        (new Date().getTime() - new Date(concept.updatedAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  // Get stage config
  const stageConfig = getStageConfig(concept.status);
  if (!stageConfig) return null;

  const StageIcon = stageConfig.icon;
  
  // Calculate completion rate based on validated checkpoints
  const completionRate = Math.round((validatedCheckpoints.length / stageConfig.validationCheckpoints.length) * 100);

  // Completion rates for stage progress
  const completionRates: Record<string, number> = {
    idea: 100,
    brainstorming: 60,
    prototyping: completionRate,
    final: 0,
  };

  // DNA override state
  const [dnaOverrides, setDnaOverrides] = useState<Record<string, boolean>>({
    description: false,
    primaryColor: false,
    secondaryColor: false,
    accentColor: false,
  });

  const handleDNAToggle = (fieldName: string) => {
    setDnaOverrides((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  if (!concept) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-headline mb-2">Concept not found</h2>
          <Button onClick={() => navigate('/app-incubator')}>
            Back to Incubator
          </Button>
        </div>
      </div>
    );
  }

  // NEW: Mark onboarding as complete
  useEffect(() => {
    if (concept?.id && showOnboarding) {
      const timer = setTimeout(() => {
        localStorage.setItem(`workspace-visited-${concept.id}`, 'true');
        setShowOnboarding(false);
      }, 30000); // Hide after 30 seconds
      return () => clearTimeout(timer);
    }
  }, [concept?.id, showOnboarding]);

  // NEW: Confetti celebration helper
  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  // NEW: Quick jump sections
  const jumpToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      toast.info(`Jumped to ${sectionId.replace('-', ' ')}`);
    }
  };

  // Handle field changes with auto-save indicator
  const handleFieldChange = (fieldName: keyof AppConcept, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    
    // NEW: Update save status
    setSaveStatus('unsaved');
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Simulate auto-save after 1 second of inactivity
    saveTimeoutRef.current = setTimeout(() => {
      setSaveStatus('saving');
      setTimeout(() => {
        setSaveStatus('saved');
      }, 500);
    }, 1000);
  };

  // Handle checkpoint validation toggle
  const handleCheckpointToggle = (checkpointId: string) => {
    if (!concept?.id) return;
    
    setValidatedCheckpoints((prev) => {
      const newSet = prev.includes(checkpointId)
        ? prev.filter((id) => id !== checkpointId)
        : [...prev, checkpointId];
      
      // Persist to localStorage
      saveConceptCheckpoints(concept.id, newSet);
      
      const isCompleting = newSet.includes(checkpointId);
      
      toast.success(
        isCompleting ? 'Checkpoint validated! ✓' : 'Checkpoint unmarked',
        {
          description: 'Progress saved',
          duration: 2000,
        }
      );
      
      // NEW: Trigger confetti when completing a checkpoint
      if (isCompleting) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
      
      // NEW: Check if all checkpoints are complete
      if (newSet.length === stageConfig.validationCheckpoints.length && isCompleting) {
        setTimeout(() => {
          triggerConfetti();
          toast.success('🎉 Stage Complete!', {
            description: 'All checkpoints validated. Ready to advance!',
            duration: 5000,
          });
        }, 500);
      }
      
      return newSet;
    });
  };

  // Handle question answer
  const handleQuestionAnswer = (index: number, answer: string) => {
    const updated = [...keyQuestions];
    updated[index] = { ...updated[index], answer };
    setKeyQuestions(updated);
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConceptImage(reader.result as string);
        toast.success('Image uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  // Mock AI extraction from image
  const handleExtractFromImage = () => {
    setIsExtractingImage(true);
    // Simulate AI processing
    setTimeout(() => {
      const mockInsights = [
        'This appears to be a productivity app with a clean, minimalist interface.',
        'The visual style suggests a modern SaaS product targeting professionals.',
        'Key UI elements: dashboard layout, card-based design, data visualization.',
        'Color scheme: Blues and neutrals indicating trust and professionalism.',
      ];
      setImageDescription(mockInsights[Math.floor(Math.random() * mockInsights.length)]);
      setIsExtractingImage(false);
      toast.success('Insights extracted from image');
    }, 1500);
  };

  const handleRemoveImage = () => {
    setConceptImage(null);
    setImageDescription('');
    toast.success('Image removed');
  };

  // Navigate to next/previous stage
  const handleStageChange = async (direction: 'next' | 'prev') => {
    const currentIndex = stages.findIndex((s) => s.id === concept.status);
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < stages.length) {
      const newStage = stages[newIndex];

      // If advancing forward and checkpoints are complete, show dialog
      if (direction === 'next' && validatedCheckpoints.length === stageConfig.validationCheckpoints.length) {
        setTargetStageId(newStage.id);
        setShowAdvanceDialog(true);
      } else {
        // Otherwise just change stage directly
        if (concept?.id) {
          await changeConceptStage(concept.id, newStage.id as any);
          toast.success(`Moved to ${newStage.label} stage!`);
          setTimeout(() => window.location.reload(), 500);
        }
      }
    }
  };

  const currentStageIndex = stages.findIndex((s) => s.id === concept.status);
  const canGoBack = currentStageIndex > 0;
  const canAdvance = currentStageIndex < stages.length - 1;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background scroll-smooth">
        {/* Sticky Top Bar - Ultra Minimal */}
        <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between px-6 py-3">
            {/* Left: Back + App Name */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/app-incubator')}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Incubator
              </Button>
              
              <Separator orientation="vertical" className="h-6" />
              
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded ${stageConfig.bgColor}`}>
                  <StageIcon className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <h1 className="text-sm font-semibold leading-none">
                    {concept.appNameInternal}
                  </h1>
                  <p className="text-xs text-muted-foreground">{stageConfig.label}</p>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {validatedCheckpoints.length}/{stageConfig.validationCheckpoints.length}
              </span>
              
              <Button variant="ghost" size="sm" className="gap-2">
                <Save className={`h-3.5 w-3.5 ${saveStatus === 'saving' ? 'animate-spin' : ''}`} />
                {saveStatus === 'saved' && 'Saved'}
                {saveStatus === 'saving' && 'Saving...'}
                {saveStatus === 'unsaved' && 'Save'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <Link to={`/style-guide/${concept.id}?type=app`}>
                  <Palette className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Focus Mode Banner */}
        <AnimatePresence>
          {focusMode && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="border-b bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 py-2 px-6"
            >
              <div className="mx-auto max-w-5xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-3.5 w-3.5 text-primary" />
                  <p className="text-xs font-medium text-primary">
                    Focus Mode: Completed items are hidden
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFocusMode(false)}
                  className="h-6 text-xs"
                >
                  Exit Focus Mode
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      {/* Document-Style Content - Single Column, Max Width */}
      <div className="mx-auto max-w-5xl px-6 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview" className="gap-2">
              <PenTool className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="progress" className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-2">
              <ListTodo className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="assets" className="gap-2">
              <Layers className="h-4 w-4" />
              Assets
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: OVERVIEW */}
          <TabsContent value="overview" className="space-y-8 mt-0">
            {/* Welcome Back Card - Session Continuity */}
            {concept.sessionState?.aiSummary && (
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold mb-2">Welcome back!</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {concept.sessionState.aiSummary}
                      </p>
                      {concept.sessionState.userNote && (
                        <div className="rounded-lg bg-background/50 p-3 border border-primary/10">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Your last note:</p>
                          <p className="text-sm">{concept.sessionState.userNote}</p>
                        </div>
                      )}
                      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Last active: {new Date(concept.sessionState.lastActiveAt).toLocaleDateString()}
                        </span>
                        {concept.sessionState.contextSnapshot && (
                          <span>
                            Health Score: {concept.sessionState.contextSnapshot.healthScore}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Separator />

            {/* Idea Cultivation Section */}
            <motion.section
              id="idea-cultivation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h2 className="text-lg font-semibold">Idea Cultivation</h2>
                  {showOnboarding && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="secondary" className="text-xs">
                          Start here
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Begin by capturing your core concept and vision</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Capture the essence of your concept with text, images, and early thoughts
                </p>
              </div>

              <div className="space-y-6">
                {/* Core Concept */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="description" className="text-sm font-medium">
                      Core Concept
                    </Label>
                    {concept.usesBusinessDNA && (
                      <DNAInheritanceIndicator
                        fieldName="description"
                        value={formData.description || ''}
                        dnaValue="Formal B2B product description"
                        businessValue="Firestone business description"
                        isOverridden={dnaOverrides.description}
                        onToggleOverride={handleDNAToggle}
                        usesBusinessDNA={concept.usesBusinessDNA}
                      />
                    )}
                  </div>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    placeholder="What is this app about? Describe your vision..."
                    rows={3}
                    className="resize-none"
                  />
                </div>

                {/* Detailed Vision */}
                <div>
                  <Label htmlFor="longDescription" className="text-sm font-medium mb-2 block">
                    Detailed Vision
                  </Label>
                  <Textarea
                    id="longDescription"
                    value={formData.longDescription || ''}
                    onChange={(e) => handleFieldChange('longDescription', e.target.value)}
                    placeholder="Expand on your idea. What makes it special? Who is it for?"
                    rows={5}
                    className="resize-none"
                  />
                </div>

                {/* Visual Inspiration */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Visual Inspiration
                  </Label>
                  
                  {!conceptImage ? (
                    <div className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        id="concept-image"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="concept-image"
                        className="cursor-pointer flex flex-col items-center gap-3"
                      >
                        <div className="rounded-full bg-muted p-4">
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">
                            Upload inspiration image
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Screenshots, mockups, or visual references
                          </p>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative rounded-lg overflow-hidden border">
                        <img
                          src={conceptImage}
                          alt="Concept inspiration"
                          className="w-full h-auto max-h-96 object-contain bg-muted"
                        />
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute top-3 right-3"
                          onClick={handleRemoveImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleExtractFromImage}
                          disabled={isExtractingImage}
                          className="gap-2"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          {isExtractingImage ? 'Analyzing...' : 'Extract Insights'}
                        </Button>
                        {imageDescription && (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <ImageIcon className="h-3 w-3" />
                            Insights extracted
                          </Badge>
                        )}
                      </div>

                      {imageDescription && (
                        <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
                          <p className="text-xs font-semibold text-primary mb-2">
                            AI Insights
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {imageDescription}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Raw Notes */}
                <div>
                  <Label htmlFor="mainPrompt" className="text-sm font-medium mb-2 block">
                    Raw Notes & Initial Prompt
                  </Label>
                  <Textarea
                    id="mainPrompt"
                    value={formData.mainPrompt || ''}
                    onChange={(e) => handleFieldChange('mainPrompt', e.target.value)}
                    placeholder="Capture your raw thoughts, questions, or the initial prompt that sparked this idea..."
                    rows={5}
                    className="resize-none font-mono text-xs"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Scratch space for early brainstorming and unstructured thinking
                  </p>
                </div>
              </div>
            </motion.section>

            <Separator />

            {/* Stage Guidance */}
            <motion.section
              id="stage-guidance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  <h2 className="text-lg font-semibold">Stage Guidance</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  {stageConfig.description}
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="text-sm font-semibold mb-3">Key Activities</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {stageConfig.keyActivities.map((activity, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.section>

            <Separator />

            {/* Validation Checkpoints */}
            <motion.section
              id="validation-checkpoints"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <h2 className="text-lg font-semibold">Validation Checkpoints</h2>
                  {showOnboarding && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="secondary" className="text-xs">
                          Complete these
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Mark checkpoints as validated once complete</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Complete these validation items to progress through this stage
                </p>
              </div>

              <div className="space-y-8">
                {stageConfig.validationCheckpoints.map((checkpoint) => {
                  const isValidated = validatedCheckpoints.includes(checkpoint.id);
                  const fieldValue = (formData[checkpoint.fieldName] as string) || '';
                  const hasContent = fieldValue.trim().length > 0;

                  return (
                    <motion.div
                      key={checkpoint.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`pb-8 border-b last:border-b-0 transition-all ${
                        isValidated ? 'opacity-75' : ''
                      } ${focusMode && isValidated ? 'opacity-50 blur-[2px] pointer-events-none' : ''}`}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <button
                          onClick={() => handleCheckpointToggle(checkpoint.id)}
                          className="shrink-0 mt-1 transition-transform hover:scale-110"
                        >
                          {isValidated ? (
                            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                          ) : (
                            <Circle className="h-6 w-6 text-muted-foreground" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Label className="text-base font-semibold">
                              {checkpoint.label}
                            </Label>
                            {hasContent && !isValidated && (
                              <Badge variant="outline" className="text-xs">
                                Draft
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            {checkpoint.description}
                          </p>

                          {/* Checkpoint Suggestions */}
                          {!hasContent && !isValidated && (
                            <CheckpointSuggestions
                              checkpointId={checkpoint.id}
                              currentStage={concept.status}
                              hasContent={hasContent}
                            />
                          )}

                          {checkpoint.fieldType === 'textarea' ? (
                            <Textarea
                              value={fieldValue}
                              onChange={(e) =>
                                handleFieldChange(checkpoint.fieldName, e.target.value)
                              }
                              placeholder={checkpoint.placeholder}
                              rows={5}
                              className="resize-none"
                            />
                          ) : checkpoint.fieldType === 'url' ? (
                            <Input
                              type="url"
                              value={fieldValue}
                              onChange={(e) =>
                                handleFieldChange(checkpoint.fieldName, e.target.value)
                              }
                              placeholder={checkpoint.placeholder}
                            />
                          ) : (
                            <Input
                              value={fieldValue}
                              onChange={(e) =>
                                handleFieldChange(checkpoint.fieldName, e.target.value)
                              }
                              placeholder={checkpoint.placeholder}
                            />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>

            <Separator />

            {/* Key Questions */}
            {stageConfig.keyQuestions.length > 0 && (
              <>
                <section>
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Circle className="h-4 w-4 text-blue-500" />
                      <h2 className="text-lg font-semibold">Key Questions</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Reflect on these questions to guide your work in this stage
                    </p>
                  </div>

                  <div className="space-y-6">
                    {stageConfig.keyQuestions.map((question, index) => {
                      const questionData = keyQuestions[index] || { question, answer: '' };
                      return (
                        <div key={index}>
                          <Label className="text-sm font-semibold mb-3 block">
                            {question}
                          </Label>
                          <Textarea
                            value={questionData.answer || ''}
                            onChange={(e) => handleQuestionAnswer(index, e.target.value)}
                            placeholder="Your thoughts..."
                            rows={4}
                            className="resize-none"
                          />
                        </div>
                      );
                    })}
                  </div>
                </section>

                <Separator />
              </>
            )}

            {/* Next Action */}
            <section>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <ChevronRight className="h-4 w-4 text-orange-500" />
                  <h2 className="text-lg font-semibold">Next Action</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  What's the immediate next step for this concept?
                </p>
              </div>

              <Textarea
                value={nextAction}
                onChange={(e) => setNextAction(e.target.value)}
                placeholder="e.g., Conduct 3 user interviews by Friday, Build landing page prototype, etc."
                rows={3}
                className="resize-none"
              />
            </section>

            <Separator />

            {/* Stage Navigation */}
            <section>
              <div className="bg-muted/50 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => handleStageChange('prev')}
                    disabled={!canGoBack}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous Stage
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-sm font-medium mb-1">
                      {stageConfig.nextStagePrompt}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {completionRate}% complete
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => handleStageChange('next')}
                    disabled={!canAdvance}
                    className="gap-2"
                  >
                    Next Stage
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </section>

            {/* Bottom Spacer */}
            <div className="h-24" />
          </TabsContent>

          {/* TAB 2: PROGRESS */}
          <TabsContent value="progress" className="space-y-8 mt-0">
            {/* Progress Tracking */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <h2 className="text-lg font-semibold">Progress Tracking</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Monitor your progress through each stage
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="text-sm font-semibold mb-3">Key Activities</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {stageConfig.keyActivities.map((activity, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.section>

            <Separator />

            {/* Validation Checkpoints */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <h2 className="text-lg font-semibold">Validation Checkpoints</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Complete these validation items to progress through this stage
                </p>
              </div>

              <div className="space-y-8">
                {stageConfig.validationCheckpoints.map((checkpoint) => {
                  const isValidated = validatedCheckpoints.includes(checkpoint.id);
                  const fieldValue = (formData[checkpoint.fieldName] as string) || '';
                  const hasContent = fieldValue.trim().length > 0;

                  return (
                    <motion.div
                      key={checkpoint.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`pb-8 border-b last:border-b-0 transition-all ${
                        isValidated ? 'opacity-75' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <button
                          onClick={() => handleCheckpointToggle(checkpoint.id)}
                          className="shrink-0 mt-1 transition-transform hover:scale-110"
                        >
                          {isValidated ? (
                            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                          ) : (
                            <Circle className="h-6 w-6 text-muted-foreground" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Label className="text-base font-semibold">
                              {checkpoint.label}
                            </Label>
                            {hasContent && !isValidated && (
                              <Badge variant="outline" className="text-xs">
                                Draft
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            {checkpoint.description}
                          </p>

                          {/* Checkpoint Suggestions */}
                          {!hasContent && !isValidated && (
                            <CheckpointSuggestions
                              checkpointId={checkpoint.id}
                              currentStage={concept.status}
                              hasContent={hasContent}
                            />
                          )}

                          {checkpoint.fieldType === 'textarea' ? (
                            <Textarea
                              value={fieldValue}
                              onChange={(e) =>
                                handleFieldChange(checkpoint.fieldName, e.target.value)
                              }
                              placeholder={checkpoint.placeholder}
                              rows={5}
                              className="resize-none"
                            />
                          ) : checkpoint.fieldType === 'url' ? (
                            <Input
                              type="url"
                              value={fieldValue}
                              onChange={(e) =>
                                handleFieldChange(checkpoint.fieldName, e.target.value)
                              }
                              placeholder={checkpoint.placeholder}
                            />
                          ) : (
                            <Input
                              value={fieldValue}
                              onChange={(e) =>
                                handleFieldChange(checkpoint.fieldName, e.target.value)
                              }
                              placeholder={checkpoint.placeholder}
                            />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>

            <Separator />

            {/* Key Questions */}
            {stageConfig.keyQuestions.length > 0 && (
              <>
                <section>
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Circle className="h-4 w-4 text-blue-500" />
                      <h2 className="text-lg font-semibold">Key Questions</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Reflect on these questions to guide your work in this stage
                    </p>
                  </div>

                  <div className="space-y-6">
                    {stageConfig.keyQuestions.map((question, index) => {
                      const questionData = keyQuestions[index] || { question, answer: '' };
                      return (
                        <div key={index}>
                          <Label className="text-sm font-semibold mb-3 block">
                            {question}
                          </Label>
                          <Textarea
                            value={questionData.answer || ''}
                            onChange={(e) => handleQuestionAnswer(index, e.target.value)}
                            placeholder="Your thoughts..."
                            rows={4}
                            className="resize-none"
                          />
                        </div>
                      );
                    })}
                  </div>
                </section>

                <Separator />
              </>
            )}

            {/* Next Action */}
            <section>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <ChevronRight className="h-4 w-4 text-orange-500" />
                  <h2 className="text-lg font-semibold">Next Action</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  What's the immediate next step for this concept?
                </p>
              </div>

              <Textarea
                value={nextAction}
                onChange={(e) => setNextAction(e.target.value)}
                placeholder="e.g., Conduct 3 user interviews by Friday, Build landing page prototype, etc."
                rows={3}
                className="resize-none"
              />
            </section>

            <Separator />

            {/* Smart Suggestions - AI-Powered Insights */}
            <section>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-purple-500" />
                  <h2 className="text-lg font-semibold">Smart Suggestions</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  AI-powered insights and patterns based on your work
                </p>
              </div>

              <SmartSuggestions
                appName={concept.appNameInternal}
                currentStage={concept.status}
                daysSinceLastUpdate={daysSinceLastUpdate}
                healthScore={concept.healthScore || 50}
                similarConcepts={[]}
              />
            </section>

            <Separator />

            {/* Stage Navigation */}
            <section>
              <div className="bg-muted/50 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => handleStageChange('prev')}
                    disabled={!canGoBack}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous Stage
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-sm font-medium mb-1">
                      {stageConfig.nextStagePrompt}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {completionRate}% complete
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => handleStageChange('next')}
                    disabled={!canAdvance}
                    className="gap-2"
                  >
                    Next Stage
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </section>

            {/* Bottom Spacer */}
            <div className="h-24" />
          </TabsContent>

          {/* TAB 3: TASKS */}
          <TabsContent value="tasks" className="space-y-8 mt-0">
            {/* Task Management */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <ListTodo className="h-4 w-4 text-blue-500" />
                  <h2 className="text-lg font-semibold">Tasks</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Manage your workflow with a kanban board
                </p>
              </div>

              {tasks.length === 0 ? (
                <BetterEmptyState
                  icon={ListTodo}
                  title="No tasks yet"
                  description="Break down your concept into actionable tasks. Create your first task to start tracking progress."
                  actionLabel="Add Your First Task"
                  onAction={() => toast.info('Click the "+ Add Task" button in the task board')}
                  gradient="blue"
                />
              ) : (
                <TaskManagement
                  tasks={tasks}
                  onChange={setTasks}
                  lastTaskInProgress={concept.sessionState?.lastTaskInProgress}
                />
              )}
            </motion.section>

            <Separator />

            {/* Blocker Tracking */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <h2 className="text-lg font-semibold">Blockers</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Track what's preventing progress on this concept
                </p>
              </div>

              {blockers.filter((b) => b.status === 'active').length === 0 ? (
                <BetterEmptyState
                  icon={PartyPopper}
                  title="No active blockers!"
                  description="Great news! You don't have any blockers preventing progress. Keep up the momentum!"
                  gradient="green"
                />
              ) : (
                <BlockerTracking blockers={blockers} onChange={setBlockers} />
              )}
            </motion.section>

            <Separator />

            {/* Stage Navigation */}
            <section>
              <div className="bg-muted/50 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => handleStageChange('prev')}
                    disabled={!canGoBack}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous Stage
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-sm font-medium mb-1">
                      {stageConfig.nextStagePrompt}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {completionRate}% complete
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => handleStageChange('next')}
                    disabled={!canAdvance}
                    className="gap-2"
                  >
                    Next Stage
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </section>

            {/* Bottom Spacer */}
            <div className="h-24" />
          </TabsContent>

          {/* TAB 4: ASSETS */}
          <TabsContent value="assets" className="space-y-8 mt-0">
            {/* Quick Links Panel */}
            {links && links.length > 0 ? (
              <>
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <LinkIcon className="h-4 w-4 text-muted-foreground" />
                          <h2 className="text-lg font-semibold">Quick Links</h2>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Important resources and references for this concept
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setShowAddLink(true)}>
                        <Plus className="h-3.5 w-3.5 mr-2" />
                        Add Link
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {links.map((link) => {
                      const getLinkIcon = (url: string) => {
                        if (url.includes('github')) return Github;
                        if (url.includes('figma')) return Figma;
                        if (url.includes('firebase')) return Settings;
                        return Globe;
                      };
                      const LinkIconComponent = getLinkIcon(link.url);
                      
                      return (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-muted/50 transition-colors text-sm group"
                        >
                          <LinkIconComponent className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="flex-1 truncate">{link.title}</span>
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      );
                    })}
                  </div>
                </motion.section>

                <Separator />
              </>
            ) : (!focusMode && (
              <BetterEmptyState
                icon={LinkIcon}
                title="No links added"
                description="Add important resources, references, and external links related to this concept."
                gradient="purple"
              />
            ))}

            {/* Prototype Assets */}
            {concept.prototypeAssetIds && concept.prototypeAssetIds.length > 0 ? (
              <>
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Layers className="h-4 w-4 text-cyan-500" />
                      <h2 className="text-lg font-semibold">Prototype Assets</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Visual references and mockups with AI analysis
                    </p>
                  </div>

                  <AssetGallery assetIds={concept.prototypeAssetIds} />
                </motion.section>

                <Separator />
              </>
            ) : (!focusMode && !links?.length && (
              <BetterEmptyState
                icon={Layers}
                title="No prototype assets"
                description="Upload mockups, wireframes, or design assets to visualize your concept."
                gradient="blue"
              />
            ))}

            {/* Prompt History Timeline  */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-indigo-500" />
                  <h2 className="text-lg font-semibold">Prompt Evolution</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Track how your concept idea has evolved over time
                </p>
              </div>

              <PromptHistoryTimeline
                prompts={prompts}
                onAdd={(prompt) => setPrompts([...prompts, prompt])}
                onEdit={(id, prompt) =>
                  setPrompts(prompts.map((p) => (p.id === id ? prompt : p)))
                }
                onDelete={(id) => setPrompts(prompts.filter((p) => p.id !== id))}
                onFork={(prompt) => {
                  const forked = {
                    ...prompt,
                    id: `prompt_${Date.now()}`,
                    timestamp: new Date().toISOString(),
                  };
                  setPrompts([...prompts, forked]);
                }}
              />
            </motion.section>

            <Separator />

            {/* Stage Navigation */}
            <section>
              <div className="bg-muted/50 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => handleStageChange('prev')}
                    disabled={!canGoBack}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous Stage
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-sm font-medium mb-1">
                      {stageConfig.nextStagePrompt}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {completionRate}% complete
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => handleStageChange('next')}
                    disabled={!canAdvance}
                    className="gap-2"
                  >
                    Next Stage
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </section>

            {/* Bottom Spacer */}
            <div className="h-24" />
          </TabsContent>

          {/* TAB 5: SETTINGS */}
          <TabsContent value="settings" className="space-y-8 mt-0">
            {/* Feature Flags Section */}
            {features && features.length > 0 && (
              <section>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Flag className="h-4 w-4 text-violet-500" />
                    <h2 className="text-lg font-semibold">Feature Flags</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Track which features are enabled for this concept
                  </p>
                </div>

                <div className="space-y-3">
                  {features.map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{feature.featureName}</p>
                          {feature.enabled && (
                            <Badge variant="secondary" className="text-xs">
                              Enabled
                            </Badge>
                          )}
                          {feature.excluded && (
                            <Badge variant="outline" className="text-xs">
                              Excluded
                            </Badge>
                          )}
                        </div>
                        {feature.notes && (
                          <p className="text-xs text-muted-foreground mt-1">{feature.notes}</p>
                        )}
                      </div>
                      <Switch
                        checked={feature.enabled || false}
                        onCheckedChange={(checked) => {
                          setFeatures((prev) =>
                            prev.map((f) =>
                              f.id === feature.id ? { ...f, enabled: checked } : f
                            )
                          );
                          toast.success(
                            `${feature.featureName} ${checked ? 'enabled' : 'disabled'}`
                          );
                        }}
                        disabled={feature.excluded}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            <Separator />

            {/* Quick Links Panel */}
            {links && links.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-base">Quick Links</CardTitle>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setShowAddLink(true)}>
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {links.map((link) => {
                      const getLinkIcon = (url: string) => {
                        if (url.includes('github')) return Github;
                        if (url.includes('figma')) return Figma;
                        if (url.includes('firebase')) return Settings;
                        return Globe;
                      };
                      const LinkIconComponent = getLinkIcon(link.url);
                      
                      return (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-muted/50 transition-colors text-sm group"
                        >
                          <LinkIconComponent className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="flex-1 truncate">{link.title}</span>
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            <Separator />

            {/* Stage Navigation */}
            <section>
              <div className="bg-muted/50 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => handleStageChange('prev')}
                    disabled={!canGoBack}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous Stage
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-sm font-medium mb-1">
                      {stageConfig.nextStagePrompt}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {completionRate}% complete
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => handleStageChange('next')}
                    disabled={!canAdvance}
                    className="gap-2"
                  >
                    Next Stage
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </section>

            {/* Bottom Spacer */}
            <div className="h-24" />
          </TabsContent>
        </Tabs>
      </div>

      {/* Archive Dialog */}
      <ArchiveDialog
        open={showArchiveDialog}
        onOpenChange={setShowArchiveDialog}
        appName={concept.appNameInternal}
        onArchive={(data) => {
          toast.success('Concept archived with learnings captured');
          setShowArchiveDialog(false);
          // In real app: update backend and redirect
          navigate('/app-incubator');
        }}
      />

      {/* Stage Advance Dialog */}
      {targetStageId && concept && (
        <StageAdvanceDialog
          open={showAdvanceDialog}
          onOpenChange={setShowAdvanceDialog}
          currentStage={stageConfig}
          nextStage={getStageConfig(targetStageId)!}
          appName={concept.appNameInternal}
          completedCheckpoints={validatedCheckpoints.length}
          totalCheckpoints={stageConfig.validationCheckpoints.length}
          onConfirm={async () => {
            if (concept?.id && targetStageId) {
              await changeConceptStage(concept.id, targetStageId as any);
              
              // Clear checkpoints for new stage
              setValidatedCheckpoints([]);
              saveConceptCheckpoints(concept.id, []);
              
              const nextStageConfig = getStageConfig(targetStageId);
              toast.success(`Advanced to ${nextStageConfig?.label} stage! 🎉`, {
                description: 'Checkpoints reset for new stage',
              });
              
              setShowAdvanceDialog(false);
              setTargetStageId(null);
              
              // Reload to show updated stage
              setTimeout(() => window.location.reload(), 600);
            }
          }}
        />
      )}
    </div>
    </TooltipProvider>
  );
}