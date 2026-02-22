import { Link } from 'react-router';
import { Lightbulb, ArrowRight, Pin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { mockFirestoneApps } from '../../lib/mock-apps-new';
import { useSelectedApp } from '../../contexts/SelectedAppContext';
import { toast } from 'sonner';

interface AppSelectorCardProps {
  message?: string;
  showTopApps?: boolean;
}

export function AppSelectorCard({ 
  message = "Select an app to see filtered content",
  showTopApps = true 
}: AppSelectorCardProps) {
  const { setSelectedApp } = useSelectedApp();

  const activeApps = mockFirestoneApps
    .filter(app => ['idea', 'brainstorming', 'prototyping'].includes(app.status))
    .slice(0, 3);

  return (
    <Card className="mb-6 border-dashed">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Pin className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base">No Active App Selected</CardTitle>
        </div>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showTopApps && activeApps.length > 0 && (
          <>
            <div>
              <p className="text-sm font-medium mb-3">Quick select from active apps:</p>
              <div className="flex flex-wrap gap-2">
                {activeApps.map(app => (
                  <Button
                    key={app.id}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedApp({
                        id: app.id,
                        name: app.appNameInternal,
                        color: app.primaryColor,
                      });
                      toast.success(`${app.appNameInternal} set as active app`);
                    }}
                  >
                    {app.appNameInternal}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>
          </>
        )}
        <Button asChild variant="default" className="w-full">
          <Link to="/app-incubator">
            <Lightbulb className="mr-2 h-4 w-4" />
            Browse All Apps
            <ArrowRight className="ml-auto h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
