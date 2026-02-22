import { createBrowserRouter } from 'react-router';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { QuickCapturePage } from './pages/QuickCapturePage';
import { AppIncubatorPage } from './pages/AppIncubatorPage';
import { IncubationWorkspacePage } from './pages/IncubationWorkspacePage';
import { WorkspacePage } from './pages/WorkspacePage';
import { BusinessDetailPage } from './pages/BusinessDetailPage';
import { BusinessEditPage } from './pages/BusinessEditPage';
import { StyleGuidePage } from './pages/StyleGuidePage';
import { AssetsPage } from './pages/AssetsPage';
import { AssetDetailPage } from './pages/AssetDetailPage';
import { AppHubPage } from './pages/AppHubPage';
import { TasksPage } from './pages/TasksPage';
import { HealthDashboardPage } from './pages/HealthDashboardPage';
import { MarketingPage } from './pages/MarketingPage';
import { ExportPage } from './pages/ExportPage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpPage } from './pages/HelpPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    children: [
      {
        index: true,
        Component: DashboardPage,
      },
      {
        path: 'capture',
        Component: QuickCapturePage,
      },
      {
        path: 'app-incubator',
        Component: AppIncubatorPage,
      },
      {
        path: 'app-incubator/:id',
        Component: IncubationWorkspacePage,
      },
      {
        path: 'workspace/:id',
        Component: WorkspacePage,
      },
      {
        path: 'app-hub',
        Component: AppHubPage,
      },
      {
        path: 'business-hub/:id',
        Component: BusinessDetailPage,
      },
      {
        path: 'business-hub/:id/edit',
        Component: BusinessEditPage,
      },
      {
        path: 'style-guide/:id',
        Component: StyleGuidePage,
      },
      {
        path: 'assets',
        Component: AssetsPage,
      },
      {
        path: 'assets/:id',
        Component: AssetDetailPage,
      },
      {
        path: 'tasks',
        Component: TasksPage,
      },
      {
        path: 'health',
        Component: HealthDashboardPage,
      },
      {
        path: 'marketing',
        Component: MarketingPage,
      },
      {
        path: 'export',
        Component: ExportPage,
      },
      {
        path: 'settings',
        Component: SettingsPage,
      },
      {
        path: 'help',
        Component: HelpPage,
      },
      {
        path: '*',
        Component: NotFoundPage,
      },
    ],
  },
]);