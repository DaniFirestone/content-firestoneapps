import { RouterProvider } from 'react-router';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from '../hooks/use-theme';
import { SelectedAppProvider } from './contexts/SelectedAppContext';
import { router } from './routes';

export default function App() {
  return (
    <ThemeProvider>
      <SelectedAppProvider>
        <RouterProvider router={router} />
        <Toaster />
      </SelectedAppProvider>
    </ThemeProvider>
  );
}