import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { spacing } from '../lib/design-tokens';

export function NotFoundPage() {
  return (
    <div className={`${spacing.page.padding} ${spacing.page.container} flex min-h-[60vh] items-center justify-center`}>
      <Card className="max-w-md">
        <CardContent className="flex flex-col items-center py-12 text-center">
          <AlertCircle className="mb-4 h-16 w-16 text-muted-foreground" />
          <h1 className="mb-2 text-4xl font-headline font-bold">404</h1>
          <p className="mb-6 text-lg text-muted-foreground">Page not found</p>
          <p className="mb-6 text-sm text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
