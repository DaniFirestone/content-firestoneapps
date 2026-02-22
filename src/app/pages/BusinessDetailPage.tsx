import { useParams } from 'react-router';
import { Building2 } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { PageHeader } from '../components/layout/PageHeader';
import { BackButton } from '../components/layout/BackButton';
import { mockBusinesses, type Business } from '../lib/mock-data';
import { mockFirestoneApps } from '../lib/mock-apps-new';
import { EmptyState } from '../components/ui/empty-state';
import { ColorSwatch } from '../components/ui/color-swatch';
import { spacing } from '../lib/design-tokens';

export function BusinessDetailPage() {
  const { id } = useParams();
  const business: Business | undefined = mockBusinesses.find((b) => b.id === id);

  if (!business) {
    return (
      <div className={`${spacing.page.padding} ${spacing.page.container}`}>
        <EmptyState
          variant="generic"
          title="Business not found"
          description="The business you're looking for doesn't exist."
          actionLabel="Back to Business DNA"
          onAction={() => (window.location.href = '/business-hub')}
        />
      </div>
    );
  }

  const apps = mockFirestoneApps.filter((app) => app.businessId === business.id);

  return (
    <div className={`${spacing.page.padding} ${spacing.page.container}`}>
      <BackButton />
      
      <PageHeader
        icon={Building2}
        title={business.companyName}
        subtitle={business.tagline}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/style-guide/${business.id}?type=business`}>
                View Style Guide
              </Link>
            </Button>
            <Button variant="outline">Edit Business</Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">Industry</h4>
              <Badge variant="outline">{business.industry || 'Not specified'}</Badge>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="mb-2 text-sm font-medium text-muted-foreground">Mission Statement</h4>
                <p className="text-sm">{business.missionStatement || 'Not defined yet'}</p>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-medium text-muted-foreground">Target Audience</h4>
                <p className="text-sm">{business.targetAudience || 'Not defined yet'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brand Identity */}
        <Card>
          <CardHeader>
            <CardTitle>Brand Identity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">Brand Personality</h4>
              <div className="flex flex-wrap gap-2">
                {(business.brandPersonality ?? []).map((value) => (
                  <Badge key={value} variant="secondary">
                    {value}
                  </Badge>
                ))}
                {(!business.brandPersonality || business.brandPersonality.length === 0) && (
                  <span className="text-sm text-muted-foreground">Not defined yet</span>
                )}
              </div>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">Brand Voice</h4>
              <p className="text-sm">{business.brandVoice || business.brandVoiceCustom || 'Not defined yet'}</p>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">Unique Selling Proposition</h4>
              <p className="text-sm">{business.uniqueSellingProposition || 'Not defined yet'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Brand Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Brand Colors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {business.colorPalette ? (
              <>
                <ColorSwatch
                  variant="medium"
                  color={business.colorPalette.primary.hex}
                  label="Primary Color"
                  sublabel={business.colorPalette.primary.hex}
                  showCopy
                />
                <ColorSwatch
                  variant="medium"
                  color={business.colorPalette.secondary.hex}
                  label="Secondary Color"
                  sublabel={business.colorPalette.secondary.hex}
                  showCopy
                />
                <ColorSwatch
                  variant="medium"
                  color={business.colorPalette.accent.hex}
                  label="Accent Color"
                  sublabel={business.colorPalette.accent.hex}
                  showCopy
                />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No color palette defined yet</p>
            )}
          </CardContent>
        </Card>

        {/* Typography */}
        <Card>
          <CardHeader>
            <CardTitle>Typography</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {business.typography ? (
              <>
                <div>
                  <h4 className="mb-2 text-sm font-medium text-muted-foreground">Primary Font</h4>
                  <p className="text-lg font-headline">{business.typography.primaryFont.font}</p>
                  <p className="text-xs text-muted-foreground mt-1">{business.typography.primaryFont.whyItWorks}</p>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium text-muted-foreground">Secondary Font</h4>
                  <p className="text-base font-body">{business.typography.secondaryFont.font}</p>
                  <p className="text-xs text-muted-foreground mt-1">{business.typography.secondaryFont.whyItWorks}</p>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No typography defined yet</p>
            )}
          </CardContent>
        </Card>

        {/* Imagery Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>Imagery</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{business.imagery ?? 'No imagery guidelines defined yet.'}</p>
          </CardContent>
        </Card>

        {/* Associated Apps */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Associated Apps ({apps.length})</CardTitle>
              <Button variant="outline" size="sm">
                Create App from DNA
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {apps.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {apps.map((app) => (
                  <Link
                    key={app.id}
                    to={`/app-incubator/${app.id}`}
                    className="flex flex-col gap-2 rounded-lg border p-4 transition-colors hover:bg-accent"
                  >
                    <h4 className="font-medium">{app.appNameInternal}</h4>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{app.description}</p>
                    <Badge variant="outline" className="w-fit text-xs">
                      {app.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No apps linked to this business yet. Create one to get started!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}