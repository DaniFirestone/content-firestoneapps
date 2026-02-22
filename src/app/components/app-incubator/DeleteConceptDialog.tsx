import { Trash2, AlertTriangle } from 'lucide-react';
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
import type { AppConcept } from '../../lib/mock-data';

interface DeleteConceptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  concept: AppConcept;
  onConfirm: () => void;
}

export function DeleteConceptDialog({
  open,
  onOpenChange,
  concept,
  onConfirm,
}: DeleteConceptDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Delete Concept
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4 pt-4">
            <div className="rounded-lg border bg-destructive/10 border-destructive/30 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-destructive mb-2">
                    This action cannot be undone
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You're about to permanently delete <span className="font-semibold text-foreground">"{concept.appNameInternal}"</span>.
                    All associated data, tasks, and progress will be lost.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Consider archiving instead:</p>
              <p className="text-xs">
                Archiving preserves your work and allows you to restore the concept later if needed.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Permanently
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}