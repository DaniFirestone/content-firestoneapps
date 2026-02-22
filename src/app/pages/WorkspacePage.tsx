import { PenTool } from 'lucide-react';
import { useParams } from 'react-router';
import { PageHeader } from '../components/layout/PageHeader';
import { BackButton } from '../components/layout/BackButton';
import { spacing } from '../lib/design-tokens';
import { WorkspaceClient } from '../components/workspace/WorkspaceClient';
import { useSelectedApp } from '../contexts/SelectedAppContext';
import { useData } from '../contexts/DataContext';

export function WorkspacePage() {
  const { id } = useParams();
  const { selectedApp } = useSelectedApp();
  const { appConcepts } = useData();

  // Determine which app to show: URL param takes priority, then selected app
  const appToShow = id
    ? appConcepts.find((a) => a.id === id)
    : selectedApp;
  
  return (
    <div className={`${spacing.page.padding} ${spacing.page.container}`}>
      <BackButton />
      <PageHeader 
        icon={PenTool}
        title={appToShow ? `${appToShow.appNamePublished || appToShow.appNameInternal} Workspace` : 'App Workspace'}
        subtitle={appToShow ? 'Manage your app development' : 'Select an app to view its workspace'}
      />
      <WorkspaceClient />
    </div>
  );
}