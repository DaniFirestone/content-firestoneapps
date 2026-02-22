import { useState } from 'react';
import { Archive, AlertTriangle, Lightbulb, BookOpen } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner';

interface ArchiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appName: string;
  onArchive: (data: {
    reason: string;
    learnings: string;
    salvageableIdeas: string;
  }) => void;
}

export function ArchiveDialog({
  open,
  onOpenChange,
  appName,
  onArchive,
}: ArchiveDialogProps) {
  const [formData, setFormData] = useState({
    reason: '',
    learnings: '',
    salvageableIdeas: '',
  });

  const handleArchive = () => {
    if (!formData.reason) {
      toast.error('Please select a reason for archiving');
      return;
    }

    onArchive(formData);
    setFormData({ reason: '', learnings: '', salvageableIdeas: '' });
  };

  const reasons = [
    {
      value: 'too-complex',
      label: 'Too Complex',
      description: 'Scope became overwhelming',
    },
    {
      value: 'lost-interest',
      label: 'Lost Interest',
      description: 'No longer excited about this',
    },
    {
      value: 'solved-differently',
      label: 'Solved Differently',
      description: 'Found an alternative solution',
    },
    {
      value: 'timing',
      label: 'Bad Timing',
      description: 'Not the right time for this',
    },
    {
      value: 'other',
      label: 'Other',
      description: 'Different reason',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Archive className="h-5 w-5 text-amber-500" />
            <DialogTitle>Archive {appName}?</DialogTitle>
          </div>
          <DialogDescription>
            Before archiving, let's capture what you learned. This helps you build
            better next time.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Reason */}
          <div>
            <Label htmlFor="reason" className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Why are you archiving this?
            </Label>
            <Select
              value={formData.reason}
              onValueChange={(value) =>
                setFormData({ ...formData, reason: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a reason..." />
              </SelectTrigger>
              <SelectContent>
                {reasons.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value}>
                    <div>
                      <p className="font-medium">{reason.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {reason.description}
                      </p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Learnings */}
          <div>
            <Label htmlFor="learnings" className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-blue-500" />
              What did you learn?
            </Label>
            <Textarea
              id="learnings"
              value={formData.learnings}
              onChange={(e) =>
                setFormData({ ...formData, learnings: e.target.value })
              }
              placeholder="What insights did you gain? What would you do differently next time?"
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Capture technical insights, market learnings, or personal reflections
            </p>
          </div>

          {/* Salvageable Ideas */}
          <div>
            <Label
              htmlFor="salvageable"
              className="flex items-center gap-2 mb-3"
            >
              <Lightbulb className="h-4 w-4 text-amber-500" />
              Any ideas worth saving?
            </Label>
            <Textarea
              id="salvageable"
              value={formData.salvageableIdeas}
              onChange={(e) =>
                setFormData({ ...formData, salvageableIdeas: e.target.value })
              }
              placeholder="Features, designs, or concepts that could be reused in other projects..."
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              These can become new concepts or be incorporated into other projects
            </p>
          </div>

          {/* Info Box */}
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Don't worry!</strong> Archived
              concepts aren't deleted. You can always unarchive and revisit them
              later. Your learnings will be saved to help inform future projects.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setFormData({ reason: '', learnings: '', salvageableIdeas: '' });
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleArchive} variant="destructive" className="gap-2">
            <Archive className="h-4 w-4" />
            Archive Concept
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
