import { useState } from 'react';
import { Activity, AlertCircle, CheckCircle2, ExternalLink, Cloud, Database, Zap, Search, Filter, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { spacing } from '../lib/design-tokens';
import { type Business, type AppConcept } from '../lib/mock-data';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';

// Marketing field validation
const marketingFields = {
  business: {
    critical: ['companyName', 'tagline', 'missionStatement', 'colorPalette'] as (keyof Business)[],
    important: ['brandVoice', 'messagingPillars', 'targetAudience', 'uniqueSellingProposition'] as (keyof Business)[],
  },
  app: {
    published: ['appNamePublished', 'description', 'longDescription', 'problemStatement', 'solutionStatement', 'appSpecificUSP', 'primaryColor'] as (keyof AppConcept)[],
    other: ['appNamePublished', 'description', 'problemStatement', 'primaryColor'] as (keyof AppConcept)[],
  },
};

// Tech/deployment fields
const techFields = {
  critical: ['stagingUrl', 'firebaseConsoleLink', 'googleCloudProjectId'] as (keyof AppConcept)[],
  important: ['developmentUrl', 'firebaseStudioLink', 'techStack'] as (keyof AppConcept)[],
};

const fieldLabels: Record<string, string> = {
  companyName: 'Company Name',
  tagline: 'Tagline',
  missionStatement: 'Mission Statement',
  brandVoice: 'Brand Voice',
  messagingPillars: 'Messaging Pillars',
  colorPalette: 'Color Palette',
  targetAudience: 'Target Audience',
  uniqueSellingProposition: 'USP',
  appNamePublished: 'Published Name',
  description: 'Description',
  longDescription: 'Long Description',
  problemStatement: 'Problem Statement',
  solutionStatement: 'Solution Statement',
  appSpecificUSP: 'App USP',
  primaryColor: 'Primary Color',
  stagingUrl: 'Staging URL',
  developmentUrl: 'Dev URL',
  firebaseConsoleLink: 'Firebase Console',
  firebaseStudioLink: 'Firebase Studio',
  googleCloudProjectId: 'GCP Project ID',
  techStack: 'Tech Stack',
};

export function HealthDashboardPage() {
  const { businesses, appConcepts } = useData();
  const [activeTab, setActiveTab] = useState('marketing');
  
  // Tech Dashboard State
  const [techSearch, setTechSearch] = useState('');
  const [techStatusFilter, setTechStatusFilter] = useState<string>('all');
  const [techChromeFilter, setTechChromeFilter] = useState<string>('all');
  const [techDataHealthFilter, setTechDataHealthFilter] = useState<string>('all');
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<string>('appNamePublished');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<{ id: string; field: string } | null>(null);
  const [localEdits, setLocalEdits] = useState<Record<string, Partial<AppConcept>>>({});

  // Calculate marketing health
  const businessMarketingHealth = businesses.map((business) => {
    const missing: string[] = [];
    [...marketingFields.business.critical, ...marketingFields.business.important].forEach((field) => {
      const value = business[field];
      const isEmpty =
        value === undefined ||
        value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'object' && Object.keys(value).length === 0);

      if (field === 'colorPalette' && value && typeof value === 'object') {
        const palette = value as any;
        if (!palette.primary?.hex || !palette.secondary?.hex || !palette.accent?.hex) {
          missing.push(field);
        }
      } else if (isEmpty) {
        missing.push(field);
      }
    });

    const isCriticalMissing = marketingFields.business.critical.some((f) => missing.includes(f));
    return { business, missing, isCriticalMissing };
  });

  const appMarketingHealth = appConcepts.map((app) => {
    const fields = app.status === 'published' ? marketingFields.app.published : marketingFields.app.other;
    const missing: string[] = [];

    fields.forEach((field) => {
      const value = app[field];
      if (value === undefined || value === null || value === '') {
        missing.push(field);
      }
    });

    return { app, missing, isCriticalMissing: missing.length > 0 };
  });

  // Calculate tech health (for apps with staging)
  const appTechHealth = appConcepts
    .filter((app) => app.hasStaging || app.status === 'published')
    .map((app) => {
      const missing: string[] = [];
      [...techFields.critical, ...techFields.important].forEach((field) => {
        const value = app[field];
        const isEmpty =
          value === undefined ||
          value === null ||
          value === '' ||
          (Array.isArray(value) && value.length === 0);

        if (isEmpty) {
          missing.push(field);
        }
      });

      const isCriticalMissing = techFields.critical.some((f) => missing.includes(f));
      return { app, missing, isCriticalMissing };
    });

  // Priority items (critical missing only)
  const priorityBusinesses = businessMarketingHealth.filter((b) => b.isCriticalMissing);
  const priorityApps = appMarketingHealth.filter((a) => a.isCriticalMissing);
  const priorityTech = appTechHealth.filter((a) => a.isCriticalMissing);

  // Tech Dashboard - calculate data health for all apps
  const techCriticalFields: (keyof AppConcept)[] = ['googleCloudProjectId', 'appNameInternal', 'status'];
  
  const techDataHealth = appConcepts.map((app) => {
    const currentApp = { ...app, ...(localEdits[app.id] || {}) };
    const missingFields: string[] = [];
    
    techCriticalFields.forEach((field) => {
      const value = currentApp[field];
      if (!value || value === '') {
        missingFields.push(field);
      }
    });
    
    if (!currentApp.chromeProfile || currentApp.chromeProfile === '') {
      missingFields.push('chromeProfile');
    }
    
    return {
      app: currentApp,
      missingFields,
      coveragePercent: Math.round(((4 - missingFields.length) / 4) * 100),
    };
  });

  // Get unique Chrome Profiles for filter
  const chromeProfiles = Array.from(
    new Set(appConcepts.map((a) => a.chromeProfile).filter(Boolean))
  );

  // Filter and sort tech apps
  let filteredTechApps = techDataHealth.map((h) => h.app);

  // Apply search
  if (techSearch) {
    filteredTechApps = filteredTechApps.filter(
      (app) =>
        app.appNamePublished?.toLowerCase().includes(techSearch.toLowerCase()) ||
        app.appNameInternal?.toLowerCase().includes(techSearch.toLowerCase()) ||
        app.slug?.toLowerCase().includes(techSearch.toLowerCase())
    );
  }

  // Apply status filter
  if (techStatusFilter !== 'all') {
    filteredTechApps = filteredTechApps.filter((app) => app.status === techStatusFilter);
  }

  // Apply chrome profile filter
  if (techChromeFilter !== 'all') {
    filteredTechApps = filteredTechApps.filter((app) => app.chromeProfile === techChromeFilter);
  }

  // Apply data health filter
  if (techDataHealthFilter !== 'all') {
    filteredTechApps = filteredTechApps.filter((app) => {
      const health = techDataHealth.find((h) => h.app.id === app.id);
      return health?.missingFields.includes(techDataHealthFilter);
    });
  }

  // Apply sorting
  filteredTechApps.sort((a, b) => {
    let aVal = a[sortColumn as keyof AppConcept] as any;
    let bVal = b[sortColumn as keyof AppConcept] as any;
    
    if (aVal === undefined) aVal = '';
    if (bVal === undefined) bVal = '';
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    
    return 0;
  });

  // Calculate overall data health percentage
  const totalCoverage = techDataHealth.reduce((sum, h) => sum + h.coveragePercent, 0);
  const avgCoverage = Math.round(totalCoverage / techDataHealth.length);

  // Handle inline editing
  const handleFieldEdit = (appId: string, field: keyof AppConcept, value: any) => {
    setLocalEdits((prev) => ({
      ...prev,
      [appId]: {
        ...(prev[appId] || {}),
        [field]: value,
      },
    }));
    // In real app, this would trigger auto-save to backend
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const toggleSelectApp = (appId: string) => {
    setSelectedAppIds((prev) =>
      prev.includes(appId) ? prev.filter((id) => id !== appId) : [...prev, appId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedAppIds.length === filteredTechApps.length) {
      setSelectedAppIds([]);
    } else {
      setSelectedAppIds(filteredTechApps.map((a) => a.id));
    }
  };

  return (
    <div className={`${spacing.page.padding} ${spacing.page.container}`}>
      <PageHeader
        icon={Activity}
        title="Health Dashboard"
        subtitle="Work by exception — prioritize critical gaps across marketing and tech"
      />

      {/* Overall Health Summary */}
      <div className={`grid gap-4 md:grid-cols-4 ${spacing.section.gap}`}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Priority Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {priorityBusinesses.length + priorityApps.length + priorityTech.length}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Need immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Marketing Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {businesses.length + appConcepts.length - priorityBusinesses.length - priorityApps.length}/
              {businesses.length + appConcepts.length}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Ready for marketing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tech Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appTechHealth.length - priorityTech.length}/{appTechHealth.length}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Deployment ready</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                ((businesses.length +
                  appConcepts.length +
                  appTechHealth.length -
                  priorityBusinesses.length -
                  priorityApps.length -
                  priorityTech.length) /
                  (businesses.length + appConcepts.length + appTechHealth.length)) *
                  100
              )}
              %
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Health score</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className={spacing.section.gap}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="tech">Tech</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        {/* Marketing Tab */}
        <TabsContent value="marketing" className="space-y-6">
          {/* Priority Section */}
          {(priorityBusinesses.length > 0 || priorityApps.length > 0) && (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-red-600 dark:text-red-400">
                ⚠️ Priority Action Items ({priorityBusinesses.length + priorityApps.length})
              </h3>

              <div className="space-y-3">
                {priorityBusinesses.map(({ business, missing }) => (
                  <Card key={business.id} className="border-red-200 dark:border-red-900">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">
                            {business.companyName} <Badge variant="outline">Business DNA</Badge>
                          </CardTitle>
                          <CardDescription className="mt-1 text-xs text-red-600 dark:text-red-400">
                            Missing {missing.length} critical field{missing.length !== 1 ? 's' : ''}
                          </CardDescription>
                        </div>
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/business-hub/${business.id}/edit`}>
                            <ExternalLink className="mr-2 h-3.5 w-3.5" />
                            Fix Now
                          </Link>
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}

                {priorityApps.map(({ app, missing }) => (
                  <Card key={app.id} className="border-red-200 dark:border-red-900">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">
                            {app.appNamePublished || app.appNameInternal}{' '}
                            <Badge variant="outline" className="capitalize">
                              {app.status}
                            </Badge>
                          </CardTitle>
                          <CardDescription className="mt-1 text-xs text-red-600 dark:text-red-400">
                            Missing {missing.length} field{missing.length !== 1 ? 's' : ''}
                          </CardDescription>
                        </div>
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/apps/${app.id}`}>
                            <ExternalLink className="mr-2 h-3.5 w-3.5" />
                            Fix Now
                          </Link>
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Field-Level Table: Businesses */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Business DNA Marketing</h3>
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="p-3 text-left font-medium">Business</th>
                      {[...marketingFields.business.critical, ...marketingFields.business.important].map((field) => (
                        <th key={field} className="p-3 text-center font-medium">
                          {fieldLabels[field] || field}
                        </th>
                      ))}
                      <th className="p-3 text-center font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {businessMarketingHealth.map(({ business, missing }) => (
                      <tr key={business.id} className="border-b">
                        <td className="p-3 font-medium">{business.companyName}</td>
                        {[...marketingFields.business.critical, ...marketingFields.business.important].map((field) => {
                          const isMissing = missing.includes(field);
                          return (
                            <td key={field} className="p-3 text-center">
                              {isMissing ? (
                                <AlertCircle className="inline h-4 w-4 text-red-500" />
                              ) : (
                                <CheckCircle2 className="inline h-4 w-4 text-green-500" />
                              )}
                            </td>
                          );
                        })}
                        <td className="p-3 text-center">
                          <Button asChild size="sm" variant="ghost">
                            <Link to={`/business-hub/${business.id}/edit`}>Edit</Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Field-Level Table: Apps */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">App Marketing Content</h3>
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="p-3 text-left font-medium">App</th>
                      <th className="p-3 text-center font-medium">Status</th>
                      {marketingFields.app.published.slice(0, 5).map((field) => (
                        <th key={field} className="p-3 text-center font-medium">
                          {fieldLabels[field] || field}
                        </th>
                      ))}
                      <th className="p-3 text-center font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appMarketingHealth.map(({ app, missing }) => (
                      <tr key={app.id} className="border-b">
                        <td className="p-3 font-medium">{app.appNamePublished || app.appNameInternal}</td>
                        <td className="p-3 text-center">
                          <Badge variant="outline" className="text-xs capitalize">
                            {app.status}
                          </Badge>
                        </td>
                        {marketingFields.app.published.slice(0, 5).map((field) => {
                          const isMissing = missing.includes(field);
                          return (
                            <td key={field} className="p-3 text-center">
                              {isMissing ? (
                                <AlertCircle className="inline h-4 w-4 text-red-500" />
                              ) : (
                                <CheckCircle2 className="inline h-4 w-4 text-green-500" />
                              )}
                            </td>
                          );
                        })}
                        <td className="p-3 text-center">
                          <Button asChild size="sm" variant="ghost">
                            <Link to={`/apps/${app.id}`}>Edit</Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Tech Tab - Fleet Management Dashboard */}
        <TabsContent value="tech" className="space-y-6">
          {/* Data Health Widget & Filters */}
          <div className="grid gap-4 md:grid-cols-5">
            <Card className="cursor-pointer hover:border-primary" onClick={() => setTechDataHealthFilter('all')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Data Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgCoverage}%</div>
                <p className="mt-1 text-xs text-muted-foreground">Infrastructure coverage</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-primary" onClick={() => setTechDataHealthFilter('googleCloudProjectId')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Missing GCP ID</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {techDataHealth.filter((h) => h.missingFields.includes('googleCloudProjectId')).length}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Click to filter</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-primary" onClick={() => setTechDataHealthFilter('appNameInternal')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Missing Internal Name</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {techDataHealth.filter((h) => h.missingFields.includes('appNameInternal')).length}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Click to filter</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-primary" onClick={() => setTechDataHealthFilter('chromeProfile')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Missing Chrome Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {techDataHealth.filter((h) => h.missingFields.includes('chromeProfile')).length}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Click to filter</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-primary" onClick={() => setTechDataHealthFilter('status')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Missing Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {techDataHealth.filter((h) => h.missingFields.includes('status')).length}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Click to filter</p>
              </CardContent>
            </Card>
          </div>

          {/* Search & Filter Bar */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                {/* Search */}
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, internal name, or slug..."
                      value={techSearch}
                      onChange={(e) => setTechSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <Select value={techStatusFilter} onValueChange={setTechStatusFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="brainstorming">Brainstorming</SelectItem>
                    <SelectItem value="prototyping">Prototyping</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>

                {/* Chrome Profile Filter */}
                <Select value={techChromeFilter} onValueChange={setTechChromeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Profiles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Profiles</SelectItem>
                    {chromeProfiles.map((profile) => (
                      <SelectItem key={profile} value={profile}>
                        {profile}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Quick Add Button */}
                <Dialog open={isQuickAddOpen} onOpenChange={setIsQuickAddOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Quick Add App
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Quick Add App</DialogTitle>
                      <DialogDescription>
                        Create a new app entry. You can fill in details later.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="appName">App Name</Label>
                        <Input id="appName" placeholder="My New App" />
                      </div>
                      <div>
                        <Label htmlFor="slug">Slug</Label>
                        <Input id="slug" placeholder="my-new-app" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsQuickAddOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => {
                        setIsQuickAddOpen(false);
                      }}>
                        Create App
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Active Filters */}
              {(techDataHealthFilter !== 'all' || techStatusFilter !== 'all' || techChromeFilter !== 'all' || techSearch) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">Active filters:</span>
                  {techDataHealthFilter !== 'all' && (
                    <Badge variant="secondary" className="cursor-pointer" onClick={() => setTechDataHealthFilter('all')}>
                      Missing: {techDataHealthFilter} ✕
                    </Badge>
                  )}
                  {techStatusFilter !== 'all' && (
                    <Badge variant="secondary" className="cursor-pointer" onClick={() => setTechStatusFilter('all')}>
                      Status: {techStatusFilter} ✕
                    </Badge>
                  )}
                  {techChromeFilter !== 'all' && (
                    <Badge variant="secondary" className="cursor-pointer" onClick={() => setTechChromeFilter('all')}>
                      Profile: {techChromeFilter} ✕
                    </Badge>
                  )}
                  {techSearch && (
                    <Badge variant="secondary" className="cursor-pointer" onClick={() => setTechSearch('')}>
                      Search: "{techSearch}" ✕
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedAppIds.length > 0 && (
            <Card className="bg-muted/50">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {selectedAppIds.length} app{selectedAppIds.length !== 1 ? 's' : ''} selected
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Update Chrome Profile
                    </Button>
                    <Button variant="outline" size="sm">
                      Update Status
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setSelectedAppIds([])}>
                      Clear Selection
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fleet Management Table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="p-3 text-left">
                      <Checkbox
                        checked={selectedAppIds.length === filteredTechApps.length && filteredTechApps.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </th>
                    <th className="p-3 text-left font-medium cursor-pointer hover:text-primary" onClick={() => handleSort('status')}>
                      <div className="flex items-center gap-1">
                        Status
                        {sortColumn === 'status' && (
                          sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                        )}
                      </div>
                    </th>
                    <th className="p-3 text-left font-medium cursor-pointer hover:text-primary" onClick={() => handleSort('appNamePublished')}>
                      <div className="flex items-center gap-1">
                        Published Name
                        {sortColumn === 'appNamePublished' && (
                          sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                        )}
                      </div>
                    </th>
                    <th className="p-3 text-left font-medium cursor-pointer hover:text-primary" onClick={() => handleSort('appNameInternal')}>
                      <div className="flex items-center gap-1">
                        Internal Name
                        {sortColumn === 'appNameInternal' && (
                          sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                        )}
                      </div>
                    </th>
                    <th className="p-3 text-left font-medium cursor-pointer hover:text-primary" onClick={() => handleSort('slug')}>
                      <div className="flex items-center gap-1">
                        Slug
                        {sortColumn === 'slug' && (
                          sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                        )}
                      </div>
                    </th>
                    <th className="p-3 text-left font-medium">Chrome Profile</th>
                    <th className="p-3 text-left font-medium">GCP Project ID</th>
                    <th className="p-3 text-center font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTechApps.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-muted-foreground">
                        No apps match your filters
                      </td>
                    </tr>
                  ) : (
                    filteredTechApps.map((app) => {
                      const health = techDataHealth.find((h) => h.app.id === app.id);
                      return (
                        <tr key={app.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">
                            <Checkbox
                              checked={selectedAppIds.includes(app.id)}
                              onCheckedChange={() => toggleSelectApp(app.id)}
                            />
                          </td>
                          <td className="p-3">
                            <Select
                              value={app.status || ''}
                              onValueChange={(value) => handleFieldEdit(app.id, 'status', value)}
                            >
                              <SelectTrigger className="h-8 w-[130px] border-dashed">
                                <SelectValue placeholder="Set status">
                                  {app.status && (
                                    <Badge variant="outline" className="text-xs capitalize">
                                      {app.status}
                                    </Badge>
                                  )}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="brainstorming">Brainstorming</SelectItem>
                                <SelectItem value="prototyping">Prototyping</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-3 font-medium">
                            {app.appNamePublished || <span className="text-muted-foreground italic">No published name</span>}
                          </td>
                          <td className="p-3">
                            {app.appNameInternal || (
                              <span className="text-muted-foreground italic">Missing</span>
                            )}
                          </td>
                          <td className="p-3 font-mono text-xs">{app.slug || <span className="text-muted-foreground italic">No slug</span>}</td>
                          <td className="p-3">
                            <Input
                              value={app.chromeProfile || ''}
                              onChange={(e) => handleFieldEdit(app.id, 'chromeProfile', e.target.value)}
                              placeholder="profile@gmail.com"
                              className="h-8 text-xs"
                            />
                          </td>
                          <td className="p-3">
                            <Input
                              value={app.googleCloudProjectId || ''}
                              onChange={(e) => handleFieldEdit(app.id, 'googleCloudProjectId', e.target.value)}
                              placeholder="project-id-123"
                              className="h-8 font-mono text-xs"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <Button asChild size="sm" variant="ghost">
                              <Link to={`/workspace/${app.id}?tab=tech`}>
                                <ExternalLink className="mr-1 h-3 w-3" />
                                Tech Config
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="border-t bg-muted/20 px-4 py-3">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Showing {filteredTechApps.length} of {appConcepts.length} apps
                </span>
                <span>
                  {selectedAppIds.length > 0 && `${selectedAppIds.length} selected`}
                </span>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Health Summary</CardTitle>
                <CardDescription>Current state across all areas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Businesses</span>
                  <Badge variant="outline">{businesses.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Apps</span>
                  <Badge variant="outline">{appConcepts.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Published Apps</span>
                  <Badge variant="outline">
                    {appConcepts.filter((a) => a.status === 'published').length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Critical Issues</span>
                  <Badge variant="destructive">
                    {priorityBusinesses.length + priorityApps.length + priorityTech.length}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common health dashboard tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/app-hub">
                    <Database className="mr-2 h-4 w-4" />
                    Manage Businesses
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/export">
                    <Zap className="mr-2 h-4 w-4" />
                    Export Ready Content
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}