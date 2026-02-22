import { Megaphone, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, ExternalLink, Sparkles } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { spacing } from '../lib/design-tokens';
import { type Business, type AppConcept } from '../lib/mock-data';
import { useData } from '../contexts/DataContext';
import { useState } from 'react';
import { Link } from 'react-router';
import { hexToRgb } from '../lib/color-utils';

// Validation criteria for Business DNA
interface BusinessMarketingFields {
  critical: (keyof Business)[];
  important: (keyof Business)[];
  polish: (keyof Business)[];
}

const businessMarketingFields: BusinessMarketingFields = {
  critical: ['companyName', 'tagline', 'missionStatement', 'colorPalette'],
  important: ['brandVoice', 'messagingPillars', 'targetAudience', 'uniqueSellingProposition'],
  polish: ['brandPersonality', 'typography', 'logoUrls', 'brandVoiceCustom'],
};

// Validation criteria for Apps (varies by status)
interface AppMarketingValidation {
  published: { critical: (keyof AppConcept)[]; important: (keyof AppConcept)[] };
  prototyping: { critical: (keyof AppConcept)[]; important: (keyof AppConcept)[] };
  brainstorming: { critical: (keyof AppConcept)[]; important: (keyof AppConcept)[] };
  idea: { critical: (keyof AppConcept)[]; important: (keyof AppConcept)[] };
}

const appMarketingFields: AppMarketingValidation = {
  published: {
    critical: [
      'appNamePublished',
      'description',
      'longDescription',
      'problemStatement',
      'solutionStatement',
      'appSpecificUSP',
      'primaryColor',
      'secondaryColor',
      'accentColor',
    ],
    important: ['brandVoice'],
  },
  prototyping: {
    critical: [
      'appNamePublished',
      'description',
      'problemStatement',
      'solutionStatement',
      'primaryColor',
      'secondaryColor',
      'accentColor',
    ],
    important: ['longDescription', 'appSpecificUSP'],
  },
  brainstorming: {
    critical: [
      'appNamePublished',
      'description',
      'problemStatement',
      'solutionStatement',
      'primaryColor',
      'secondaryColor',
      'accentColor',
    ],
    important: ['longDescription', 'appSpecificUSP'],
  },
  idea: {
    critical: ['appNamePublished', 'description', 'problemStatement'],
    important: ['primaryColor', 'secondaryColor', 'accentColor'],
  },
};

// Field labels for display
const fieldLabels: Record<string, string> = {
  companyName: 'Company Name',
  tagline: 'Tagline',
  missionStatement: 'Mission Statement',
  brandVoice: 'Brand Voice',
  brandVoiceCustom: 'Custom Brand Voice',
  brandPersonality: 'Brand Personality',
  messagingPillars: 'Messaging Pillars',
  colorPalette: 'Color Palette',
  typography: 'Typography',
  logoUrls: 'Logo',
  targetAudience: 'Target Audience',
  uniqueSellingProposition: 'Unique Selling Proposition',
  appNamePublished: 'Published App Name',
  description: 'Description',
  longDescription: 'Long Description',
  problemStatement: 'Problem Statement',
  solutionStatement: 'Solution Statement',
  appSpecificUSP: 'App-Specific USP',
  primaryColor: 'Primary Color',
  secondaryColor: 'Secondary Color',
  accentColor: 'Accent Color',
  backgroundColor: 'Background Color',
  finalSummary: 'Final Summary',
};

interface MarketingStatus {
  score: number;
  percentage: number;
  missingCritical: string[];
  missingImportant: string[];
  missingPolish: string[];
  completedFields: string[];
}

function calculateBusinessMarketing(business: Business): MarketingStatus {
  const missing = {
    critical: [] as string[],
    important: [] as string[],
    polish: [] as string[],
  };
  const completed: string[] = [];

  // Check critical fields
  businessMarketingFields.critical.forEach((field) => {
    const value = business[field];
    const isEmpty =
      value === undefined ||
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && Object.keys(value).length === 0);

    // Special handling for colorPalette - check if it has primary, secondary, accent
    if (field === 'colorPalette' && value && typeof value === 'object') {
      const palette = value as any;
      if (!palette.primary?.hex || !palette.secondary?.hex || !palette.accent?.hex) {
        missing.critical.push(fieldLabels[field] || field);
      } else {
        completed.push(fieldLabels[field] || field);
      }
    } else if (isEmpty) {
      missing.critical.push(fieldLabels[field] || field);
    } else {
      completed.push(fieldLabels[field] || field);
    }
  });

  // Check important fields
  businessMarketingFields.important.forEach((field) => {
    const value = business[field];
    const isEmpty =
      value === undefined ||
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0);

    if (isEmpty) {
      missing.important.push(fieldLabels[field] || field);
    } else {
      completed.push(fieldLabels[field] || field);
    }
  });

  // Check polish fields
  businessMarketingFields.polish.forEach((field) => {
    const value = business[field];
    const isEmpty =
      value === undefined ||
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0);

    if (isEmpty) {
      missing.polish.push(fieldLabels[field] || field);
    } else {
      completed.push(fieldLabels[field] || field);
    }
  });

  // Calculate score (weighted)
  const criticalTotal = businessMarketingFields.critical.length * 3;
  const importantTotal = businessMarketingFields.important.length * 2;
  const polishTotal = businessMarketingFields.polish.length * 1;
  const maxScore = criticalTotal + importantTotal + polishTotal;

  const criticalScore = (businessMarketingFields.critical.length - missing.critical.length) * 3;
  const importantScore = (businessMarketingFields.important.length - missing.important.length) * 2;
  const polishScore = (businessMarketingFields.polish.length - missing.polish.length) * 1;
  const actualScore = criticalScore + importantScore + polishScore;

  return {
    score: actualScore,
    percentage: Math.round((actualScore / maxScore) * 100),
    missingCritical: missing.critical,
    missingImportant: missing.important,
    missingPolish: missing.polish,
    completedFields: completed,
  };
}

function calculateAppMarketing(app: AppConcept): MarketingStatus {
  const status = app.status as keyof AppMarketingValidation;
  const fields = appMarketingFields[status] || appMarketingFields.idea;

  const missing = {
    critical: [] as string[],
    important: [] as string[],
  };
  const completed: string[] = [];

  // Check critical fields
  fields.critical.forEach((field) => {
    const value = app[field];
    const isEmpty = value === undefined || value === null || value === '';

    if (isEmpty) {
      missing.critical.push(fieldLabels[field] || field);
    } else {
      completed.push(fieldLabels[field] || field);
    }
  });

  // Check important fields
  fields.important.forEach((field) => {
    const value = app[field];
    const isEmpty = value === undefined || value === null || value === '';

    if (isEmpty) {
      missing.important.push(fieldLabels[field] || field);
    } else {
      completed.push(fieldLabels[field] || field);
    }
  });

  // Calculate score (weighted)
  const criticalTotal = fields.critical.length * 3;
  const importantTotal = fields.important.length * 2;
  const maxScore = criticalTotal + importantTotal;

  const criticalScore = (fields.critical.length - missing.critical.length) * 3;
  const importantScore = (fields.important.length - missing.important.length) * 2;
  const actualScore = criticalScore + importantScore;

  return {
    score: actualScore,
    percentage: Math.round((actualScore / maxScore) * 100),
    missingCritical: missing.critical,
    missingImportant: missing.important,
    missingPolish: [],
    completedFields: completed,
  };
}

export function MarketingPage() {
  const { businesses, appConcepts } = useData();
  const [expandedBusinesses, setExpandedBusinesses] = useState<Set<string>>(new Set());
  const [expandedApps, setExpandedApps] = useState<Set<string>>(new Set());

  const toggleBusiness = (id: string) => {
    setExpandedBusinesses((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleApp = (id: string) => {
    setExpandedApps((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Calculate marketing status for all items
  const businessStatuses = businesses
    .filter((b) => b.status === 'active')
    .map((business) => ({
      business,
      status: calculateBusinessMarketing(business),
    }))
    .sort((a, b) => {
      // Sort by: missing critical first, then by percentage
      if (a.status.missingCritical.length !== b.status.missingCritical.length) {
        return b.status.missingCritical.length - a.status.missingCritical.length;
      }
      return a.status.percentage - b.status.percentage;
    });

  const appStatuses = appConcepts
    .filter((app) => app.status !== 'archived')
    .map((app) => ({
      app,
      status: calculateAppMarketing(app),
    }))
    .sort((a, b) => {
      // Published apps with missing fields first
      if (a.app.status === 'published' && b.app.status !== 'published') return -1;
      if (a.app.status !== 'published' && b.app.status === 'published') return 1;
      // Then by missing critical
      if (a.status.missingCritical.length !== b.status.missingCritical.length) {
        return b.status.missingCritical.length - a.status.missingCritical.length;
      }
      return a.status.percentage - b.status.percentage;
    });

  // Calculate summary stats
  const totalBusinesses = businessStatuses.length;
  const businessesReady = businessStatuses.filter((b) => b.status.percentage >= 90).length;
  const totalApps = appStatuses.length;
  const appsReady = appStatuses.filter((a) => a.status.percentage >= 90).length;
  const publishedApps = appStatuses.filter((a) => a.app.status === 'published').length;

  const getAppColors = (app: AppConcept) => {
    if (app.primaryColor && app.secondaryColor && app.accentColor) {
      return {
        primary: app.primaryColor,
        secondary: app.secondaryColor,
        accent: app.accentColor,
      };
    }

    if (app.businessId) {
      const business = businesses.find((b) => b.id === app.businessId);
      if (business?.colorPalette) {
        return {
          primary: business.colorPalette.primary.hex,
          secondary: business.colorPalette.secondary.hex,
          accent: business.colorPalette.accent.hex,
        };
      }
    }

    return null;
  };

  const getBusinessColors = (business: Business) => {
    if (business.colorPalette) {
      return {
        primary: business.colorPalette.primary.hex,
        secondary: business.colorPalette.secondary.hex,
        accent: business.colorPalette.accent.hex,
      };
    }
    return null;
  };

  const getBackgroundStyle = (primaryColor: string) => {
    const rgb = hexToRgb(primaryColor);
    if (!rgb) return {};
    return {
      backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.02)`,
    };
  };

  return (
    <div className={`${spacing.page.padding} ${spacing.page.container}`}>
      <PageHeader
        icon={Megaphone}
        title="Marketing Dashboard"
        subtitle="Work by exception — fill in missing fields to complete your marketing profiles"
        actions={
          <Button variant="outline">
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        }
      />

      {/* Summary Stats */}
      <div className={`grid gap-4 md:grid-cols-4 ${spacing.section.gap}`}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Business DNA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {businessesReady}/{totalBusinesses}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Ready for marketing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Apps Ready</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appsReady}/{totalApps}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Marketing complete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Published Apps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedApps}</div>
            <p className="mt-1 text-xs text-muted-foreground">Live in production</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                ((businessesReady + appsReady) / (totalBusinesses + totalApps)) * 100
              )}
              %
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Marketing readiness</p>
          </CardContent>
        </Card>
      </div>

      {/* Business DNA Marketing Profiles */}
      <div className={spacing.section.gap}>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Business DNA Marketing Profiles</h2>
          <p className="text-sm text-muted-foreground">
            Foundation profiles that apps can inherit from
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {businessStatuses.map(({ business, status }) => {
            const isExpanded = expandedBusinesses.has(business.id);
            const totalMissing =
              status.missingCritical.length +
              status.missingImportant.length +
              status.missingPolish.length;
            const colors = getBusinessColors(business);

            return (
              <Card
                key={business.id}
                className="flex flex-col overflow-hidden transition-all hover:shadow-md"
                style={colors ? getBackgroundStyle(colors.primary) : {}}
              >
                {/* Colored top border */}
                {colors && (
                  <div
                    className="h-1.5"
                    style={{
                      background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.accent} 100%)`,
                    }}
                  />
                )}

                <CardHeader className="pb-3">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-base leading-snug">
                        {business.companyName}
                      </CardTitle>
                      {business.tagline && (
                        <p className="mt-1 text-xs text-muted-foreground">{business.tagline}</p>
                      )}
                    </div>
                    <Badge
                      variant={status.percentage >= 90 ? 'default' : 'secondary'}
                      className="shrink-0"
                    >
                      {status.percentage}%
                    </Badge>
                  </div>

                  {/* Progress Bar */}
                  <Progress value={status.percentage} className="h-2" />
                </CardHeader>

                <CardContent className="flex-1 space-y-3 pt-0">
                  {/* Missing Fields (Exception Highlighting) */}
                  {status.missingCritical.length > 0 && (
                    <div className="rounded-md border border-red-200 bg-red-50 p-2.5 dark:border-red-900/30 dark:bg-red-950/20">
                      <div className="mb-1 flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                        <p className="text-xs font-semibold text-red-700 dark:text-red-300">
                          Critical Missing ({status.missingCritical.length})
                        </p>
                      </div>
                      <ul className="space-y-0.5">
                        {status.missingCritical.map((field) => (
                          <li key={field} className="text-xs text-red-600 dark:text-red-400">
                            • {field}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {status.missingImportant.length > 0 && (
                    <div className="rounded-md border border-amber-200 bg-amber-50 p-2.5 dark:border-amber-900/30 dark:bg-amber-950/20">
                      <div className="mb-1 flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                        <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                          Important Missing ({status.missingImportant.length})
                        </p>
                      </div>
                      <ul className="space-y-0.5">
                        {status.missingImportant.slice(0, 3).map((field) => (
                          <li key={field} className="text-xs text-amber-600 dark:text-amber-400">
                            • {field}
                          </li>
                        ))}
                        {status.missingImportant.length > 3 && (
                          <li className="text-xs text-amber-600 dark:text-amber-400">
                            + {status.missingImportant.length - 3} more
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Expandable Polish Fields */}
                  {status.missingPolish.length > 0 && !isExpanded && (
                    <button
                      onClick={() => toggleBusiness(business.id)}
                      className="w-full rounded-md border border-blue-200 bg-blue-50 p-2.5 text-left transition-colors hover:bg-blue-100 dark:border-blue-900/30 dark:bg-blue-950/20 dark:hover:bg-blue-950/30"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                          Polish Items ({status.missingPolish.length})
                        </p>
                        <ChevronDown className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      </div>
                    </button>
                  )}

                  {isExpanded && status.missingPolish.length > 0 && (
                    <div className="rounded-md border border-blue-200 bg-blue-50 p-2.5 dark:border-blue-900/30 dark:bg-blue-950/20">
                      <button
                        onClick={() => toggleBusiness(business.id)}
                        className="mb-1 flex w-full items-center justify-between"
                      >
                        <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                          Polish Missing ({status.missingPolish.length})
                        </p>
                        <ChevronUp className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      </button>
                      <ul className="space-y-0.5">
                        {status.missingPolish.map((field) => (
                          <li key={field} className="text-xs text-blue-600 dark:text-blue-400">
                            • {field}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Quick Preview - Show completed count */}
                  {totalMissing === 0 && (
                    <div className="rounded-md border border-emerald-200 bg-emerald-50 p-2.5 dark:border-emerald-900/30 dark:bg-emerald-950/20">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                          Marketing Ready
                        </p>
                      </div>
                      <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                        All {status.completedFields.length} fields complete
                      </p>
                    </div>
                  )}
                </CardContent>

                <CardContent className="border-t pt-3">
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="w-full"
                    style={
                      colors
                        ? {
                            borderColor: colors.primary + '40',
                            color: colors.primary,
                          }
                        : {}
                    }
                  >
                    <Link to={`/business-dna/${business.id}`}>
                      Complete Profile
                      <ExternalLink className="ml-2 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* App Marketing Profiles */}
      <div className={spacing.section.gap}>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">App Marketing Profiles</h2>
          <p className="text-sm text-muted-foreground">
            Individual app marketing content and assets
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {appStatuses.map(({ app, status }) => {
            const isExpanded = expandedApps.has(app.id);
            const totalMissing = status.missingCritical.length + status.missingImportant.length;
            const colors = getAppColors(app);

            return (
              <Card
                key={app.id}
                className="flex flex-col overflow-hidden transition-all hover:shadow-md"
                style={colors ? getBackgroundStyle(colors.primary) : {}}
              >
                {/* Colored top border */}
                {colors && (
                  <div
                    className="h-1.5"
                    style={{
                      background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.accent} 100%)`,
                    }}
                  />
                )}

                <CardHeader className="pb-3">
                  <div className="mb-3 flex items-start gap-3">
                    {/* App Icon */}
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-semibold text-white"
                      style={
                        colors
                          ? {
                              background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                            }
                          : {
                              background: 'hsl(var(--primary))',
                            }
                      }
                    >
                      {app.appNameInternal.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base leading-snug">
                        {app.appNamePublished || app.appNameInternal}
                      </CardTitle>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="outline" className="text-xs capitalize">
                          {app.status}
                        </Badge>
                        <Badge
                          variant={status.percentage >= 90 ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {status.percentage}%
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <Progress value={status.percentage} className="h-2" />
                </CardHeader>

                <CardContent className="flex-1 space-y-3 pt-0">
                  {/* Missing Fields (Exception Highlighting) */}
                  {status.missingCritical.length > 0 && (
                    <div className="rounded-md border border-red-200 bg-red-50 p-2.5 dark:border-red-900/30 dark:bg-red-950/20">
                      <div className="mb-1 flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                        <p className="text-xs font-semibold text-red-700 dark:text-red-300">
                          Critical Missing ({status.missingCritical.length})
                        </p>
                      </div>
                      <ul className="space-y-0.5">
                        {status.missingCritical.map((field) => (
                          <li key={field} className="text-xs text-red-600 dark:text-red-400">
                            • {field}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {status.missingImportant.length > 0 && !isExpanded && (
                    <button
                      onClick={() => toggleApp(app.id)}
                      className="w-full rounded-md border border-amber-200 bg-amber-50 p-2.5 text-left transition-colors hover:bg-amber-100 dark:border-amber-900/30 dark:bg-amber-950/20 dark:hover:bg-amber-950/30"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                          Important Missing ({status.missingImportant.length})
                        </p>
                        <ChevronDown className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                      </div>
                    </button>
                  )}

                  {isExpanded && status.missingImportant.length > 0 && (
                    <div className="rounded-md border border-amber-200 bg-amber-50 p-2.5 dark:border-amber-900/30 dark:bg-amber-950/20">
                      <button
                        onClick={() => toggleApp(app.id)}
                        className="mb-1 flex w-full items-center justify-between"
                      >
                        <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                          Important Missing ({status.missingImportant.length})
                        </p>
                        <ChevronUp className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                      </button>
                      <ul className="space-y-0.5">
                        {status.missingImportant.map((field) => (
                          <li key={field} className="text-xs text-amber-600 dark:text-amber-400">
                            • {field}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Quick Preview - Show description when complete */}
                  {totalMissing === 0 && app.description && (
                    <div className="rounded-md border border-emerald-200 bg-emerald-50 p-2.5 dark:border-emerald-900/30 dark:bg-emerald-950/20">
                      <div className="mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                          Marketing Ready
                        </p>
                      </div>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">
                        {app.description}
                      </p>
                    </div>
                  )}
                </CardContent>

                <CardContent className="border-t pt-3">
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="w-full"
                    style={
                      colors
                        ? {
                            borderColor: colors.primary + '40',
                            color: colors.primary,
                          }
                        : {}
                    }
                  >
                    <Link to={`/apps/${app.id}`}>
                      Complete Profile
                      <ExternalLink className="ml-2 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}