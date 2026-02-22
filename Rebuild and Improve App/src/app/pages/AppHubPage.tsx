import { Building2 } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { spacing } from '../lib/design-tokens';
import { AppHubClient } from '../components/app-hub/AppHubClient';

export function AppHubPage() {
  return (
    <div className={`${spacing.page.padding} ${spacing.page.container}`}>
      <PageHeader
        icon={Building2}
        title="App Workspaces"
        subtitle="Your businesses and applications in one place"
      />
      <AppHubClient />
    </div>
  );
}
