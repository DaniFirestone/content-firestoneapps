import { Lightbulb, Brain, Layers, CheckCircle2, Archive } from 'lucide-react';

interface Stage {
  id: string;
  label: string;
  color: string;
  bgColor: string;
  icon: typeof Lightbulb;
}

const STAGES: Stage[] = [
  { id: 'idea', label: 'Idea', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-500', icon: Lightbulb },
  { id: 'brainstorming', label: 'Brainstorming', color: 'text-indigo-600 dark:text-indigo-400', bgColor: 'bg-indigo-500', icon: Brain },
  { id: 'prototyping', label: 'Prototyping', color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-500', icon: Layers },
  { id: 'final', label: 'Final', color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-500', icon: CheckCircle2 },
  { id: 'archived', label: 'Archived', color: 'text-gray-500 dark:text-gray-400', bgColor: 'bg-gray-400', icon: Archive },
];

interface LifecycleIndicatorProps {
  currentStage: string;
  className?: string;
  variant?: 'full' | 'compact';
}

export function LifecycleIndicator({ currentStage, className = '', variant = 'compact' }: LifecycleIndicatorProps) {
  const currentStageIndex = STAGES.findIndex((s) => s.id === currentStage);
  const currentStageData = STAGES[currentStageIndex];
  const progress = ((currentStageIndex + 1) / STAGES.length) * 100;

  if (!currentStageData) return null;

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`${currentStageData.bgColor} rounded p-1 text-white shrink-0`}>
          <currentStageData.icon className="h-3.5 w-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className={`text-xs font-medium ${currentStageData.color}`}>
              {currentStageData.label}
            </span>
            <span className="text-[10px] font-medium text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div 
              className={`h-full transition-all ${currentStageData.bgColor}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Stage label with icon */}
      <div className="flex items-center gap-1.5">
        <div className={`${currentStageData.bgColor} rounded-full p-1 text-white`}>
          <currentStageData.icon className="h-3 w-3" />
        </div>
        <span className="text-xs font-medium text-foreground">
          {currentStageData.label}
        </span>
      </div>

      {/* Progress bar with stage dots */}
      <div className="relative flex items-center gap-1">
        {STAGES.map((stage, idx) => {
          const isPast = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;
          const isFuture = idx > currentStageIndex;

          return (
            <div key={stage.id} className="relative flex items-center flex-1">
              {/* Dot */}
              <div
                className={`
                  relative z-10 h-2 w-2 rounded-full transition-all
                  ${isCurrent ? `${stage.bgColor} ring-2 ring-offset-1 ring-offset-background ring-${stage.bgColor.replace('bg-', '')}` : ''}
                  ${isPast ? `${stage.bgColor}` : ''}
                  ${isFuture ? 'bg-border' : ''}
                `}
                title={stage.label}
              />

              {/* Connector line */}
              {idx < STAGES.length - 1 && (
                <div
                  className={`
                    absolute left-2 top-1/2 h-0.5 w-[calc(100%-8px)] -translate-y-1/2 transition-all
                    ${isPast ? stage.bgColor : 'bg-border'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress percentage */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">
          Stage {currentStageIndex + 1} of {STAGES.length}
        </span>
        <span className="text-[10px] font-medium text-muted-foreground">
          {Math.round(progress)}% complete
        </span>
      </div>
    </div>
  );
}