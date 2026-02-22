import { useState } from 'react';
import { Archive, AlertTriangle } from 'lucide-react';
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
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import type { AppConcept } from '../../lib/mock-data';

interface ArchiveConceptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  concept: AppConcept;
  onConfirm: (reason: string) => void;
}

export function ArchiveConceptDialog({
  open,
  onOpenChange,
  concept,
  onConfirm,
}: ArchiveConceptDialogProps) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    onConfirm(reason);
    setReason('');
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-amber-500" />
            Archive Concept
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4 pt-4">
            <div className="rounded-lg border bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                    You're about to archive "{concept.appNameInternal}"
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                    This concept will be moved to archived status. You can restore it later if needed.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="archive-reason" className="text-sm font-medium">
                Reason (Optional)
              </Label>
              <Textarea
                id="archive-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Why are you archiving this concept? Any learnings to capture?"
                rows={3}
                className="resize-none text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Documenting why you're archiving helps with future decisions.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setReason('')}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="gap-2">
            <Archive className="h-4 w-4" />
            Archive Concept
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}