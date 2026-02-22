import { stages } from '../../lib/stage-config';
import { CheckCircle2, Circle } from 'lucide-react';

interface StageProgressVisualizationProps {
  currentStageId: string;
  completionRates: Record<string, number>;
  onStageClick?: (stageId: string) => void;
}

export function StageProgressVisualization({
  currentStageId,
  completionRates,
  onStageClick,
}: StageProgressVisualizationProps) {
  return (
    <div className="flex items-center gap-1">
      {stages.map((stage, index) => {
        const isCurrent = stage.id === currentStageId;
        const currentIndex = stages.findIndex((s) => s.id === currentStageId);
        const isPast = index < currentIndex;
        const completion = completionRates[stage.id] || 0;
        const StageIcon = stage.icon;

        return (
          <button
            key={stage.id}
            onClick={() => onStageClick?.(stage.id)}
            className={`group relative flex items-center transition-all ${
              onStageClick ? 'cursor-pointer' : 'cursor-default'
            }`}
            title={`${stage.label}: ${completion}% complete`}
          >
            {/* Connector Line */}
            {index > 0 && (
              <div
                className={`w-6 h-0.5 ${
                  isPast ? 'bg-primary' : 'bg-muted'
                } transition-colors`}
              />
            )}

            {/* Stage Node */}
            <div
              className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                isCurrent
                  ? `${stage.bgColor} border-transparent scale-110`
                  : isPast
                  ? 'bg-primary/10 border-primary'
                  : 'bg-muted border-muted-foreground/30'
              } ${onStageClick ? 'group-hover:scale-125' : ''}`}
            >
              {isPast ? (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              ) : (
                <StageIcon
                  className={`h-3.5 w-3.5 ${
                    isCurrent ? 'text-white' : 'text-muted-foreground'
                  }`}
                />
              )}

              {/* Completion Ring */}
              {completion > 0 && !isPast && (
                <svg
                  className="absolute inset-0 -rotate-90"
                  viewBox="0 0 32 32"
                >
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray={`${completion * 0.88} 88`}
                    className="text-primary"
                  />
                </svg>
              )}
            </div>

            {/* Tooltip */}
            {onStageClick && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-popover text-popover-foreground text-xs px-2 py-1 rounded border shadow-lg whitespace-nowrap">
                  {stage.label}
                  <br />
                  <span className="text-muted-foreground">{completion}%</span>
                </div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
