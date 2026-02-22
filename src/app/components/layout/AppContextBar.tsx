import { Link } from 'react-router';
import { Pin, X, PenTool, Edit, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useSelectedApp } from '../../contexts/SelectedAppContext';
import { toast } from 'sonner';

interface AppContextBarProps {
  showInPage?: boolean;
  contextMessage?: string;
}

export function AppContextBar({ showInPage = false, contextMessage }: AppContextBarProps) {
  const { selectedApp, setSelectedApp } = useSelectedApp();

  if (!selectedApp) return null;

  // Different styles for in-page vs header placement
  if (showInPage) {
    return (
      <div className="mb-6 px-4 py-3 rounded-lg border bg-background/50 flex items-center justify-between group">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div 
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: selectedApp.color || 'hsl(var(--primary))' }}
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{selectedApp.name}</p>
            {contextMessage && (
              <p className="text-xs text-muted-foreground">{contextMessage}</p>
            )}
          </div>
          <Button 
            asChild 
            size="sm"
            variant="outline"
          >
            <Link to={`/workspace/${selectedApp.id}`}>
              Open Workspace
            </Link>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 shrink-0 ml-2"
          onClick={() => {
            setSelectedApp(null);
            toast.info('App deselected');
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  // Compact header bar version
  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b bg-background/50">
      <div 
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: selectedApp.color || 'hsl(var(--primary))' }}
      />
      <span className="text-sm font-medium truncate flex-1">{selectedApp.name}</span>
      <Link 
        to={`/workspace/${selectedApp.id}`}
        className="text-xs font-medium hover:underline text-muted-foreground hover:text-foreground"
      >
        Workspace
      </Link>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0"
        onClick={() => {
          setSelectedApp(null);
          toast.info('App deselected');
        }}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}