import { useState } from 'react';
import { Clock, Plus, Copy, Edit, Trash2, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { toast } from 'sonner';

interface Prompt {
  id: string;
  content: string;
  notes?: string;
  timestamp: string;
}

interface PromptHistoryTimelineProps {
  prompts: Prompt[];
  onAdd: (prompt: Prompt) => void;
  onEdit: (id: string, prompt: Prompt) => void;
  onDelete: (id: string) => void;
  onFork: (prompt: Prompt) => void;
}

export function PromptHistoryTimeline({
  prompts,
  onAdd,
  onEdit,
  onDelete,
  onFork,
}: PromptHistoryTimelineProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ content: '', notes: '' });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!formData.content.trim()) {
      toast.error('Prompt content is required');
      return;
    }

    const promptData: Prompt = {
      id: editingId || `prompt_${Date.now()}`,
      content: formData.content,
      notes: formData.notes,
      timestamp: new Date().toISOString(),
    };

    if (editingId) {
      onEdit(editingId, promptData);
      toast.success('Prompt updated');
    } else {
      onAdd(promptData);
      toast.success('Prompt added');
    }

    setFormData({ content: '', notes: '' });
    setShowAddDialog(false);
    setEditingId(null);
  };

  const handleEdit = (prompt: Prompt) => {
    setEditingId(prompt.id);
    setFormData({ content: prompt.content, notes: prompt.notes || '' });
    setShowAddDialog(true);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Prompt copied to clipboard');
  };

  const handleFork = (prompt: Prompt) => {
    setFormData({ content: prompt.content, notes: `Forked from: ${prompt.notes || 'previous version'}` });
    setShowAddDialog(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {prompts.length} {prompts.length === 1 ? 'version' : 'versions'}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddDialog(true)}
          className="gap-2"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Prompt
        </Button>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {prompts.map((prompt, index) => {
          const isExpanded = expandedId === prompt.id;
          const isLatest = index === prompts.length - 1;

          return (
            <div
              key={prompt.id}
              className={`relative pl-6 pb-3 ${
                index !== prompts.length - 1 ? 'border-l-2 border-muted' : ''
              }`}
            >
              {/* Timeline dot */}
              <div
                className={`absolute left-0 top-1 -translate-x-1/2 w-3 h-3 rounded-full border-2 ${
                  isLatest
                    ? 'bg-primary border-primary'
                    : 'bg-background border-muted-foreground'
                }`}
              />

              <div className={`rounded-lg border p-3 ${isLatest ? 'border-primary/50 bg-primary/5' : ''}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(prompt.timestamp).toLocaleString()}
                      </span>
                      {isLatest && (
                        <Badge variant="secondary" className="text-xs">
                          Latest
                        </Badge>
                      )}
                    </div>
                    {prompt.notes && (
                      <p className="text-xs font-medium text-muted-foreground">
                        {prompt.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleCopy(prompt.content)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleEdit(prompt)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleFork(prompt)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    {prompts.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => {
                          onDelete(prompt.id);
                          toast.success('Prompt deleted');
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>

                <div
                  className={`text-sm font-mono ${
                    isExpanded ? '' : 'line-clamp-2'
                  }`}
                >
                  {prompt.content}
                </div>

                {prompt.content.length > 100 && (
                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : prompt.id)
                    }
                    className="text-xs text-primary hover:underline mt-1"
                  >
                    {isExpanded ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit Prompt' : 'Add New Prompt'}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Update your prompt and add notes about the changes'
                : 'Add a new iteration of your concept prompt'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="content">Prompt Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Describe what you want to build..."
                rows={6}
                className="resize-none font-mono text-sm"
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="e.g., Added user auth requirements"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false);
                setEditingId(null);
                setFormData({ content: '', notes: '' });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingId ? 'Update' : 'Add'} Prompt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
