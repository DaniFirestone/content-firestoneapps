import { Lightbulb, Brain, Layers, CheckCircle2, Archive, type LucideIcon } from 'lucide-react';

interface Stage {
  id: string;
  label: string;
  icon: LucideIcon;
  activeColor: string;
  activeBg: string;
  activeBorder: string;
  activeText: string;
}

const STAGES: Stage[] = [
  {
    id: 'idea',
    label: 'Idea',
    icon: Lightbulb,
    activeColor: 'bg-blue-600',
    activeBg: 'bg-blue-50 dark:bg-blue-900/20',
    activeBorder: 'border-blue-600',
    activeText: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'brainstorming',
    label: 'Brainstorming',
    icon: Brain,
    activeColor: 'bg-indigo-600',
    activeBg: 'bg-indigo-50 dark:bg-indigo-900/20',
    activeBorder: 'border-indigo-600',
    activeText: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    id: 'prototyping',
    label: 'Prototyping',
    icon: Layers,
    activeColor: 'bg-amber-500',
    activeBg: 'bg-amber-50 dark:bg-amber-900/20',
    activeBorder: 'border-amber-500',
    activeText: 'text-amber-600 dark:text-amber-400',
  },
  {
    id: 'final',
    label: 'Final',
    icon: CheckCircle2,
    activeColor: 'bg-emerald-600',
    activeBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    activeBorder: 'border-emerald-600',
    activeText: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'archived',
    label: 'Archive',
    icon: Archive,
    activeColor: 'bg-gray-500',
    activeBg: 'bg-gray-50 dark:bg-gray-900/20',
    activeBorder: 'border-gray-500',
    activeText: 'text-gray-500 dark:text-gray-400',
  },
];

const STAGE_ORDER = STAGES.map((s) => s.id);

interface LifecyclePipelineProps {
  /** If provided, highlights this stage as the current one */
  currentStage?: string;
  /** Counts per stage, shown below each label */
  stageCounts?: Record<string, number>;
  /** If provided, clicking a stage calls this with the stage id (or 'all' when clicking active) */
  onStageClick?: (stageId: string) => void;
  /** The currently selected filter (for interactive mode) */
  selectedFilter?: string;
}

export function LifecyclePipeline({
  currentStage,
  stageCounts,
  onStageClick,
  selectedFilter,
}: LifecyclePipelineProps) {
  const currentIndex = currentStage ? STAGE_ORDER.indexOf(currentStage) : -1;

  const isCompleted = (stageId: string) => {
    const idx = STAGE_ORDER.indexOf(stageId);
    return currentIndex >= 0 && idx < currentIndex;
  };

  const isActive = (stageId: string) => stageId === currentStage;
  const isSelected = (stageId: string) => stageId === selectedFilter;

  const handleClick = (stageId: string) => {
    if (!onStageClick) return;
    // Toggle off if already selected
    onStageClick(selectedFilter === stageId ? 'all' : stageId);
  };

  return (
    <div className="flex items-center w-full select-none overflow-x-auto pb-1">
      {STAGES.map((stage, idx) => {
        const Icon = stage.icon;
        const active = isActive(stage.id);
        const completed = isCompleted(stage.id);
        const selected = isSelected(stage.id);
        const interactive = !!onStageClick;

        // Circle styling
        const circleFilled = active || completed || selected;
        const circleClass = circleFilled
          ? `${stage.activeColor} text-white shadow-sm`
          : 'bg-background text-muted-foreground border-2 border-border';

        // Connector line — solid if leading edge is completed/active
        const lineCompleted = currentIndex >= 0 && idx < currentIndex;
        const lineClass = lineCompleted
          ? 'bg-primary'
          : 'border-t-2 border-dashed border-border bg-transparent';

        const count = stageCounts?.[stage.id];

        return (
          <div key={stage.id} className="flex items-center flex-1 min-w-0">
            {/* Stage node */}
            <div
              className={`flex flex-col items-center gap-1.5 shrink-0 ${interactive ? 'cursor-pointer group' : ''}`}
              onClick={() => handleClick(stage.id)}
              role={interactive ? 'button' : undefined}
              aria-pressed={interactive ? selected : undefined}
            >
              {/* Circle */}
              <div
                className={`
                  flex h-10 w-10 items-center justify-center rounded-full transition-all
                  ${circleClass}
                  ${interactive ? 'group-hover:scale-110' : ''}
                  ${selected && !circleFilled ? `border-2 ${stage.activeBorder} ${stage.activeText}` : ''}
                `}
              >
                <Icon className="h-5 w-5" />
              </div>

              {/* Label */}
              <span
                className={`
                  text-xs text-center whitespace-nowrap transition-colors
                  ${active || selected ? `${stage.activeText} font-semibold` : completed ? 'text-foreground font-medium' : 'text-muted-foreground'}
                `}
              >
                {stage.label}
              </span>

              {/* Count badge */}
              {count !== undefined && count > 0 && (
                <span
                  className={`
                    -mt-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-medium
                    ${active || selected ? `${stage.activeColor} text-white` : 'bg-muted text-muted-foreground'}
                  `}
                >
                  {count}
                </span>
              )}
            </div>

            {/* Connector line between stages */}
            {idx < STAGES.length - 1 && (
              <div className={`flex-1 mx-1 h-0.5 mt-[-20px] ${lineCompleted ? lineClass : ''}`}>
                {!lineCompleted && (
                  <div className="w-full border-t-2 border-dashed border-border" />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
