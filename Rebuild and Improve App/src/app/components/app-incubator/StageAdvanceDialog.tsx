import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
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
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import type { StageConfig } from '../../lib/stage-config';

interface StageAdvanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStage: StageConfig;
  nextStage: StageConfig;
  appName: string;
  completedCheckpoints: number;
  totalCheckpoints: number;
  onConfirm: () => void;
}

export function StageAdvanceDialog({
  open,
  onOpenChange,
  currentStage,
  nextStage,
  appName,
  completedCheckpoints,
  totalCheckpoints,
  onConfirm,
}: StageAdvanceDialogProps) {
  const CurrentIcon = currentStage.icon;
  const NextIcon = nextStage.icon;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Ready to Advance!
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4 pt-4">
            {/* App Name */}
            <div>
              <p className="text-sm font-medium text-foreground mb-1">{appName}</p>
              <p className="text-xs text-muted-foreground">
                You've completed all checkpoints in the {currentStage.label} stage.
              </p>
            </div>

            {/* Progress Summary */}
            <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Current Progress
                </span>
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {completedCheckpoints}/{totalCheckpoints}
                </Badge>
              </div>
              <Progress value={100} className="h-2" />
              <ul className="space-y-1.5">
                {currentStage.validationCheckpoints.map((cp) => (
                  <li key={cp.id} className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                    <span className="text-muted-foreground">{cp.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stage Transition */}
            <div className="flex items-center justify-center gap-4 py-2">
              <div className="flex flex-col items-center gap-2">
                <div className={`p-3 rounded-lg ${currentStage.bgColor}`}>
                  <CurrentIcon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium">{currentStage.label}</span>
              </div>

              <ArrowRight className="h-5 w-5 text-muted-foreground" />

              <div className="flex flex-col items-center gap-2">
                <div className={`p-3 rounded-lg ${nextStage.bgColor}`}>
                  <NextIcon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium">{nextStage.label}</span>
              </div>
            </div>

            {/* Next Stage Preview */}
            <div className="rounded-lg border bg-primary/5 border-primary/20 p-4">
              <p className="text-xs font-semibold text-primary mb-2">What's Next?</p>
              <p className="text-xs text-muted-foreground mb-3">{nextStage.description}</p>
              <div className="space-y-1">
                <p className="text-xs font-medium text-foreground">Key Focus Areas:</p>
                {nextStage.keyActivities.slice(0, 3).map((activity, i) => (
                  <p key={i} className="text-xs text-muted-foreground">• {activity}</p>
                ))}
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Not Yet</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="gap-2">
            <ArrowRight className="h-4 w-4" />
            Advance to {nextStage.label}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
