import { useState } from 'react';
import { Images, Upload, Plus, Grid3X3, List, Filter } from 'lucide-react';
import { Link } from 'react-router';
import { PageHeader } from '../components/layout/PageHeader';
import { AppContextBar } from '../components/layout/AppContextBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { EmptyState } from '../components/ui/empty-state';
import { spacing } from '../lib/design-tokens';
import { useSelectedApp } from '../contexts/SelectedAppContext';
import { useData } from '../contexts/DataContext';
 
export function AssetsPage() {
  const { selectedApp } = useSelectedApp();
  const { assets } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter assets by selected app if one is active
  const filteredAssets = selectedApp 
    ? assets.filter(asset => asset.assignedToAppId === selectedApp.id)
    : assets;

  const inboxAssets = filteredAssets.filter((a) => a.status === 'inbox');
  const processedAssets = filteredAssets.filter((a) => a.status === 'processed');

  const getTypeColor = (type: string) => {
    const colors = {
      image: 'bg-blue-100 text-blue-700',
      prompt: 'bg-purple-100 text-purple-700',
      note: 'bg-yellow-100 text-yellow-700',
      document: 'bg-green-100 text-green-700',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className={`${spacing.page.padding} ${spacing.page.container}`}>
      <PageHeader
        icon={Images}
        title="Assets"
        subtitle={selectedApp 
          ? `Assets for ${selectedApp.name}` 
          : "Manage your images, prompts, and content library"
        }
        actions={
          <>
            <Button variant="outline" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
            </Button>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Assets
            </Button>
          </>
        }
      />

      {/* App Context Bar */}
      <AppContextBar 
        showInPage 
        contextMessage="Viewing and managing assets for this app"
      />

      <Tabs defaultValue="library" className="space-y-6">
        <TabsList>
          <TabsTrigger value="capture">Quick Capture</TabsTrigger>
          <TabsTrigger value="inbox">Inbox ({inboxAssets.length})</TabsTrigger>
          <TabsTrigger value="library">Library ({processedAssets.length})</TabsTrigger>
        </TabsList>

        {/* Quick Capture Tab */}
        <TabsContent value="capture">
          <Card>
            <CardHeader>
              <CardTitle>Quick Capture Zone</CardTitle>
              <CardDescription>Drag and drop files or paste content quickly</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 p-16 text-center">
                <div className="space-y-3">
                  <Upload className="mx-auto h-16 w-16 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-medium">Drop files here</p>
                    <p className="text-sm text-muted-foreground">or click to browse</p>
                  </div>
                  <Button>Select Files</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inbox Tab */}
        <TabsContent value="inbox">
          {inboxAssets.length === 0 ? (
            <EmptyState
              variant="assets"
              title="Inbox is empty"
              description="All assets have been triaged. New uploads will appear here."
            />
          ) : (
            <div className="space-y-4">
              {inboxAssets.map((asset) => (
                <Card key={asset.id}>
                  <CardContent className="flex items-center gap-4 py-4">
                    {asset.thumbnailUrl && (
                      <img
                        src={asset.thumbnailUrl}
                        alt={asset.name}
                        className="h-20 w-20 rounded object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">{asset.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{asset.description}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {asset.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Process
                      </Button>
                      <Button variant="ghost" size="sm">
                        Archive
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Library Tab */}
        <TabsContent value="library" className="space-y-4">
          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <Input
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Assets Grid/List */}
          {processedAssets.length === 0 ? (
            <EmptyState
              variant="assets"
              actionLabel="Upload Asset"
              onAction={() => {}}
            />
          ) : viewMode === 'grid' ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {processedAssets.map((asset) => (
                <Card key={asset.id} className="overflow-hidden transition-all hover:shadow-elevation-3">
                  <Link to={`/assets/${asset.id}`}>
                    {asset.thumbnailUrl ? (
                      <img
                        src={asset.thumbnailUrl}
                        alt={asset.name}
                        className="h-48 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-48 items-center justify-center bg-muted">
                        <Images className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <CardContent className="space-y-2 pt-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-1 font-medium">{asset.name}</h3>
                        <Badge variant="outline" className={`text-xs ${getTypeColor(asset.type)}`}>
                          {asset.type}
                        </Badge>
                      </div>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {asset.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {asset.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {processedAssets.map((asset) => (
                <Card key={asset.id}>
                  <CardContent className="flex items-center gap-4 py-3">
                    <Badge variant="outline" className={getTypeColor(asset.type)}>
                      {asset.type}
                    </Badge>
                    <div className="flex-1">
                      <Link to={`/assets/${asset.id}`} className="font-medium hover:underline">
                        {asset.name}
                      </Link>
                      <p className="mt-1 text-sm text-muted-foreground">{asset.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {asset.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}