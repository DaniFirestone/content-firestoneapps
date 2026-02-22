import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { Building2, Save, ArrowLeft, Palette, FileText, Briefcase, Globe } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { PageHeader } from '../components/layout/PageHeader';
import { ColorPicker } from '../components/ui/color-picker';
import { spacing } from '../lib/design-tokens';
import { useData } from '../contexts/DataContext';
import { EmptyState } from '../components/ui/empty-state';

export function BusinessEditPage() {
  const { id } = useParams<{ id: string }>();
  const { businesses } = useData();
  const business = businesses.find((b) => b.id === id);

  const [formData, setFormData] = useState({
    companyName: business?.companyName || '',
    tagline: business?.tagline || '',
    description: business?.description || '',
    website: business?.website || '',
    industry: business?.industry || '',
    primaryColor: business?.colorPalette?.primary.hex || '#3B82F6',
    secondaryColor: business?.colorPalette?.secondary.hex || '#8B5CF6',
    accentColor: business?.colorPalette?.accent.hex || '#EC4899',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!business) {
    return (
      <div className={`${spacing.page.padding} ${spacing.page.container}`}>
        <EmptyState
          icon={Building2}
          title="Business Not Found"
          description="The business you're looking for doesn't exist."
          actionLabel="Back to App Hub"
          onAction={() => (window.location.href = '/app-hub')}
        />
      </div>
    );
  }

  return (
    <div className={`${spacing.page.padding} ${spacing.page.container}`}>
      <PageHeader
        icon={Building2}
        title={`Edit ${business.companyName}`}
        subtitle="Update business information and brand identity"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to="/app-hub">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        }
      />

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">
            <Briefcase className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="brand">
            <Palette className="mr-2 h-4 w-4" />
            Brand Identity
          </TabsTrigger>
          <TabsTrigger value="details">
            <FileText className="mr-2 h-4 w-4" />
            Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Core details about your business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  placeholder="Enter company name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={formData.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  placeholder="A brief tagline for your business"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe your business..."
                  rows={4}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleChange('website', e.target.value)}
                      placeholder="https://example.com"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => handleChange('industry', e.target.value)}
                    placeholder="e.g., Technology, Healthcare"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brand" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Color Palette</CardTitle>
              <CardDescription>
                Define your brand's visual identity with colors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <ColorPicker
                    value={formData.primaryColor}
                    onChange={(color) => handleChange('primaryColor', color)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Main brand color
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Secondary Color</Label>
                  <ColorPicker
                    value={formData.secondaryColor}
                    onChange={(color) => handleChange('secondaryColor', color)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Supporting color
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <ColorPicker
                    value={formData.accentColor}
                    onChange={(color) => handleChange('accentColor', color)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Highlight color
                  </p>
                </div>
              </div>

              {/* Color Preview */}
              <div className="rounded-lg border p-6">
                <h4 className="mb-4 text-sm font-medium">Preview</h4>
                <div className="flex gap-3">
                  <div
                    className="h-20 flex-1 rounded-lg"
                    style={{ backgroundColor: formData.primaryColor }}
                  />
                  <div
                    className="h-20 flex-1 rounded-lg"
                    style={{ backgroundColor: formData.secondaryColor }}
                  />
                  <div
                    className="h-20 flex-1 rounded-lg"
                    style={{ backgroundColor: formData.accentColor }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
              <CardDescription>
                Extended business information and metadata
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Additional business details can be added here, such as founding date,
                team size, location, and other relevant information.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
