import { useParams } from 'react-router';
import { Images, Download, Edit, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { BackButton } from '../components/layout/BackButton';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { EmptyState } from '../components/ui/empty-state';
import { spacing } from '../lib/design-tokens';
import { useData } from '../contexts/DataContext';

export function AssetDetailPage() {
  const { id } = useParams();
  const { assets } = useData();
  const asset = assets.find((a) => a.id === id);

  if (!asset) {
    return (
      <div className={`${spacing.page.padding} ${spacing.page.container}`}>
        <EmptyState
          variant="assets"
          title="Asset not found"
          description="The asset you're looking for doesn't exist."
          actionLabel="Back to Assets"
          onAction={() => (window.location.href = '/assets')}
        />
      </div>
    );
  }

  return (
    <div className={`${spacing.page.padding} ${spacing.page.container}`}>
      <BackButton />
      
      <PageHeader
        icon={Images}
        title={asset.name}
        subtitle={asset.description}
        actions={
          <>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {asset.type === 'image' && asset.url ? (
                <img src={asset.url} alt={asset.name} className="w-full rounded-lg" />
              ) : asset.type === 'prompt' || asset.type === 'note' ? (
                <pre className="whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm">
                  {asset.content}
                </pre>
              ) : (
                <div className="flex h-64 items-center justify-center rounded-lg bg-muted">
                  <Images className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Metadata */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Type</div>
                <Badge variant="outline" className="mt-1">
                  {asset.type}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <Badge variant="secondary" className="mt-1">
                  {asset.status}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Created</div>
                <div className="mt-1 font-medium">{new Date(asset.createdAt).toLocaleDateString()}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {asset.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
