import { Outlet } from 'react-router';
import { SidebarProvider } from '../ui/sidebar';
import { Header } from './Header';
import { SidebarNav } from './SidebarNav';
import { MobileFloatingActions } from './MobileFloatingActions';
import { SkipLink } from './SkipLink';
import { ErrorBoundary } from '../ui/error-boundary';
import { useAuth } from '../../contexts/AuthContext';
import { SignInPage } from '../../pages/SignInPage';

export function AppLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <SignInPage />;
  }

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