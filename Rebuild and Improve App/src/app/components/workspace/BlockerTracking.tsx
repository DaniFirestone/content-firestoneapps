import { useState } from 'react';
import { AlertCircle, Plus, X, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { toast } from 'sonner';

interface Blocker {
  id: string;
  description: string;
  type: 'technical' | 'decision' | 'external' | 'motivation' | 'resources';
  status: 'active' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
  resolution?: string;
}

interface BlockerTrackingProps {
  blockers: Blocker[];
  onChange: (blockers: Blocker[]) => void;
}

export function BlockerTracking({ blockers, onChange }: BlockerTrackingProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    type: 'technical' as Blocker['type'],
    resolution: '',
  });

  const activeBlockers = blockers.filter((b) => b.status === 'active');
  const resolvedBlockers = blockers.filter((b) => b.status === 'resolved');

  const handleAddBlocker = () => {
    if (!formData.description.trim()) {
      toast.error('Please describe the blocker');
      return;
    }

    const newBlocker: Blocker = {
      id: `blocker_${Date.now()}`,
      description: formData.description,
      type: formData.type,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    onChange([...blockers, newBlocker]);
    setFormData({ description: '', type: 'technical', resolution: '' });
    setShowAddDialog(false);
    toast.success('Blocker added');
  };

  const handleResolveBlocker = (blockerId: string) => {
    if (!formData.resolution.trim()) {
      toast.error('Please describe how you resolved this');
      return;
    }

    const updated = blockers.map((b) =>
      b.id === blockerId
        ? {
            ...b,
            status: 'resolved' as const,
            resolvedAt: new Date().toISOString(),
            resolution: formData.resolution,
          }
        : b
    );

    onChange(updated);
    setFormData({ description: '', type: 'technical', resolution: '' });
    setResolvingId(null);
    toast.success('Blocker resolved! 🎉');
  };

  const handleDeleteBlocker = (blockerId: string) => {
    onChange(blockers.filter((b) => b.id !== blockerId));
    toast.success('Blocker removed');
  };

  const getTypeColor = (type: Blocker['type']) => {
    switch (type) {
      case 'technical':
        return 'bg-red-500/10 text-red-700 border-red-200';
      case 'decision':
        return 'bg-purple-500/10 text-purple-700 border-purple-200';
      case 'external':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'motivation':
        return 'bg-amber-500/10 text-amber-700 border-amber-200';
      case 'resources':
        return 'bg-orange-500/10 text-orange-700 border-orange-200';
    }
  };

  const getTypeLabel = (type: Blocker['type']) => {
    switch (type) {
      case 'technical':
        return 'Technical';
      case 'decision':
        return 'Decision';
      case 'external':
        return 'External';
      case 'motivation':
        return 'Motivation';
      case 'resources':
        return 'Resources';
    }
  };

  const getSuggestion = (type: Blocker['type']) => {
    switch (type) {
      case 'technical':
        return 'Try breaking it into smaller chunks or asking for help';
      case 'decision':
        return 'List pros/cons or set a deadline to decide';
      case 'external':
        return 'Identify dependencies and create a follow-up plan';
      case 'motivation':
        return 'Take a break, review your "why", or work on something easier';
      case 'resources':
        return 'Look for alternatives, learn the skill, or adjust scope';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {activeBlockers.length} active{' '}
            {activeBlockers.length === 1 ? 'blocker' : 'blockers'}
          </p>
          {activeBlockers.length > 2 && (
            <p className="text-xs text-amber-600 font-medium mt-1">
              ⚠️ Multiple blockers detected - consider archiving if stuck too long
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddDialog(true)}
          className="gap-2"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Blocker
        </Button>
      </div>

      {/* Active Blockers */}
      {activeBlockers.length > 0 && (
        <div className="space-y-3">
          {activeBlockers.map((blocker) => (
            <div
              key={blocker.id}
              className="rounded-lg border-2 border-amber-200 bg-amber-50/50 p-4"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className={getTypeColor(blocker.type)}
                      >
                        {getTypeLabel(blocker.type)}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(blocker.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleDeleteBlocker(blocker.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  <p className="text-sm mb-3">{blocker.description}</p>

                  <div className="rounded-md bg-background/50 border p-3 mb-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Suggested Action:
                    </p>
                    <p className="text-xs">{getSuggestion(blocker.type)}</p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setResolvingId(blocker.id)}
                    className="gap-2"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Mark as Resolved
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resolved Blockers */}
      {resolvedBlockers.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2">
            <span>Resolved Blockers ({resolvedBlockers.length})</span>
          </summary>
          <div className="mt-3 space-y-2">
            {resolvedBlockers.map((blocker) => (
              <div
                key={blocker.id}
                className="rounded-lg border bg-muted/30 p-3 text-sm"
              >
                <div className="flex items-start gap-2 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="line-through text-muted-foreground mb-1">
                      {blocker.description}
                    </p>
                    {blocker.resolution && (
                      <p className="text-xs text-emerald-700">
                        ✓ {blocker.resolution}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </details>
      )}

      {/* Empty State */}
      {blockers.length === 0 && (
        <div className="rounded-lg border-2 border-dashed p-8 text-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-sm font-medium mb-1">No blockers! 🎉</p>
          <p className="text-xs text-muted-foreground">
            You're making great progress
          </p>
        </div>
      )}

      {/* Add Blocker Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Blocker</DialogTitle>
            <DialogDescription>
              Document what's preventing progress on this concept
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="type">Blocker Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: Blocker['type']) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical - Can't figure out how</SelectItem>
                  <SelectItem value="decision">Decision - Not sure which direction</SelectItem>
                  <SelectItem value="external">External - Waiting on something/someone</SelectItem>
                  <SelectItem value="motivation">Motivation - Lost momentum</SelectItem>
                  <SelectItem value="resources">Resources - Missing skills/tools</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">What's blocking you?</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe the blocker in detail..."
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false);
                setFormData({ description: '', type: 'technical', resolution: '' });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddBlocker}>Add Blocker</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Blocker Dialog */}
      <Dialog
        open={resolvingId !== null}
        onOpenChange={(open) => !open && setResolvingId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Blocker</DialogTitle>
            <DialogDescription>
              How did you overcome this blocker?
            </DialogDescription>
          </DialogHeader>

          <div>
            <Label htmlFor="resolution">Resolution</Label>
            <Textarea
              id="resolution"
              value={formData.resolution}
              onChange={(e) =>
                setFormData({ ...formData, resolution: e.target.value })
              }
              placeholder="Describe how you resolved this blocker..."
              rows={4}
              className="resize-none"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setResolvingId(null);
                setFormData({ ...formData, resolution: '' });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => resolvingId && handleResolveBlocker(resolvingId)}
            >
              Mark as Resolved
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
