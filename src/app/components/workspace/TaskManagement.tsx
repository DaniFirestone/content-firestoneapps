import { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Pause,
  Plus,
  GripVertical,
  Trash2,
  Flag,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
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
import type { AppTask } from '../../lib/mock-data';
import { toast } from 'sonner';

interface TaskManagementProps {
  tasks: AppTask[];
  onChange: (tasks: AppTask[]) => void;
  lastTaskInProgress?: string;
}

export function TaskManagement({
  tasks,
  onChange,
  lastTaskInProgress,
}: TaskManagementProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<AppTask | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    notes: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const columns = [
    { id: 'todo', label: 'To Do', color: 'text-muted-foreground' },
    { id: 'in_progress', label: 'In Progress', color: 'text-blue-600' },
    { id: 'done', label: 'Done', color: 'text-emerald-600' },
    { id: 'parked', label: 'Parked', color: 'text-amber-600' },
  ] as const;

  const handleStatusChange = (taskId: string, newStatus: AppTask['status']) => {
    const updated = tasks.map((t) =>
      t.id === taskId ? { ...t, status: newStatus } : t
    );
    onChange(updated);
    toast.success('Task updated');
  };

  const handleAddTask = () => {
    if (!formData.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    const newTask: AppTask = {
      id: `task_${Date.now()}`,
      title: formData.title,
      status: 'todo',
      priority: formData.priority,
      notes: formData.notes || undefined,
    };

    onChange([...tasks, newTask]);
    setFormData({ title: '', notes: '', priority: 'medium' });
    setShowAddDialog(false);
    toast.success('Task added');
  };

  const handleDeleteTask = (taskId: string) => {
    onChange(tasks.filter((t) => t.id !== taskId));
    toast.success('Task deleted');
  };

  const getPriorityColor = (priority: AppTask['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-amber-500';
      case 'low':
        return 'text-blue-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTasksByStatus = (status: AppTask['status']) =>
    tasks.filter((t) => t.status === status);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            {tasks.filter((t) => t.status === 'done').length} of {tasks.length}{' '}
            completed
          </p>
          {lastTaskInProgress && (
            <p className="text-xs text-primary">
              Last working on: {tasks.find((t) => t.id === lastTaskInProgress)?.title}
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
          Add Task
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-4 gap-3">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);

          return (
            <div key={column.id} className="space-y-2">
              <div className="flex items-center gap-2 px-2">
                <h4 className={`text-xs font-semibold uppercase ${column.color}`}>
                  {column.label}
                </h4>
                <Badge variant="secondary" className="text-xs">
                  {columnTasks.length}
                </Badge>
              </div>

              <div className="space-y-2 min-h-[200px] rounded-lg border-2 border-dashed p-2">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    className="group relative rounded-lg border bg-card p-3 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-medium leading-tight">
                            {task.title}
                          </p>
                          <Flag
                            className={`h-3 w-3 shrink-0 ${getPriorityColor(
                              task.priority
                            )}`}
                          />
                        </div>
                        {task.notes && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {task.notes}
                          </p>
                        )}

                        {/* Status Actions */}
                        <div className="flex items-center gap-1 mt-2">
                          {column.id !== 'todo' && (
                            <button
                              onClick={() => handleStatusChange(task.id, 'todo')}
                              className="text-xs text-muted-foreground hover:text-foreground"
                            >
                              <Circle className="h-3 w-3" />
                            </button>
                          )}
                          {column.id !== 'in_progress' && (
                            <button
                              onClick={() =>
                                handleStatusChange(task.id, 'in_progress')
                              }
                              className="text-xs text-blue-600 hover:text-blue-700"
                            >
                              <Circle className="h-3 w-3" />
                            </button>
                          )}
                          {column.id !== 'done' && (
                            <button
                              onClick={() => handleStatusChange(task.id, 'done')}
                              className="text-xs text-emerald-600 hover:text-emerald-700"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                            </button>
                          )}
                          {column.id !== 'parked' && (
                            <button
                              onClick={() => handleStatusChange(task.id, 'parked')}
                              className="text-xs text-amber-600 hover:text-amber-700"
                            >
                              <Pause className="h-3 w-3" />
                            </button>
                          )}
                          <div className="flex-1" />
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="opacity-0 group-hover:opacity-100 text-xs text-destructive hover:text-destructive/80"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {columnTasks.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-xs text-muted-foreground">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a task to track work on this concept
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Build authentication flow"
              />
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: 'low' | 'medium' | 'high') =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Additional context or requirements..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false);
                setFormData({ title: '', notes: '', priority: 'medium' });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
