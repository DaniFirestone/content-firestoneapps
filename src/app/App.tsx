import { RouterProvider } from 'react-router';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from '../hooks/use-theme';
import { AuthProvider } from './contexts/AuthContext';
import { SelectedAppProvider } from './contexts/SelectedAppContext';
import { DataProvider } from './contexts/DataContext';
import { router } from './routes';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <SelectedAppProvider>
            <RouterProvider router={router} />
            <Toaster />
          </SelectedAppProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}