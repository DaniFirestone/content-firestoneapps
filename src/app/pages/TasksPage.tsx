import { useState } from 'react';
import { ListTodo, Plus, Check, Circle, Clock } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { AppContextBar } from '../components/layout/AppContextBar';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { EmptyState } from '../components/ui/empty-state';
import { spacing } from '../lib/design-tokens';
import { useSelectedApp } from '../contexts/SelectedAppContext';
import { useData } from '../contexts/DataContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export function TasksPage() {
  const { selectedApp } = useSelectedApp();
  const { tasks } = useData();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Filter tasks by selected app if one is active
  const appFilteredTasks = selectedApp
    ? tasks.filter(task => task.assignedToAppId === selectedApp.id)
    : tasks;

  const filteredTasks = appFilteredTasks.filter((task) => {
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const todoTasks = filteredTasks.filter((t) => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'in-progress');
  const doneTasks = filteredTasks.filter((t) => t.status === 'done');

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-green-100 text-green-700',
    };
    return colors[priority as keyof typeof colors];
  };

  const TaskCard = ({ task }: { task: typeof tasks[0] }) => (
    <Card>
      <CardContent className="flex items-start gap-3 py-4">
        <div className={`mt-0.5 h-5 w-5 rounded border ${task.status === 'done' ? 'bg-green-500 border-green-500' : 'border-muted-foreground'} flex items-center justify-center`}>
          {task.status === 'done' ? <Check className="h-3 w-3 text-white" /> : task.status === 'in-progress' ? <Clock className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{task.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="outline" className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
            {task.dueDate && (
              <Badge variant="secondary" className="text-xs">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </Badge>
            )}
          </div>
        </div>
        <Button variant="ghost" size="sm">
          Edit
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className={`${spacing.page.padding} ${spacing.page.container}`}>
      <PageHeader
        icon={ListTodo}
        title="Tasks"
        subtitle={selectedApp 
          ? `Tasks for ${selectedApp.name}`
          : "Manage all your development tasks across projects"
        }
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        }
      />

      {/* App Context Bar */}
      <AppContextBar 
        showInPage 
        contextMessage="Viewing and managing tasks for this app"
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {tasks.length === 0 ? (
        <EmptyState
          variant="tasks"
          actionLabel="Create Task"
          onAction={() => {}}
        />
      ) : (
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All ({filteredTasks.length})</TabsTrigger>
            <TabsTrigger value="todo">To Do ({todoTasks.length})</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress ({inProgressTasks.length})</TabsTrigger>
            <TabsTrigger value="done">Done ({doneTasks.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </TabsContent>

          <TabsContent value="todo" className="space-y-3">
            {todoTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-3">
            {inProgressTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </TabsContent>

          <TabsContent value="done" className="space-y-3">
            {doneTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}