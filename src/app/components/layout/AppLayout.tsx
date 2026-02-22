import { Outlet } from 'react-router';
import { SidebarProvider } from '../ui/sidebar';
import { Header } from './Header';
import { SidebarNav } from './SidebarNav';
import { MobileFloatingActions } from './MobileFloatingActions';
import { SkipLink } from './SkipLink';
import { ErrorBoundary } from '../ui/error-boundary';

export function AppLayout() {
  return (
    <ErrorBoundary>
      <SidebarProvider>
        <SkipLink />
        <div className="flex min-h-screen w-full">
          <SidebarNav />
          <div className="flex flex-1 flex-col">
            <Header />
            <main id="main-content" className="flex-1 bg-background">
              <Outlet />
            </main>
          </div>
        </div>
        <MobileFloatingActions />
      </SidebarProvider>
    </ErrorBoundary>
  );
}