import { useState } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router';
import { Download, Moon, Share2, Check, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { useData } from '../contexts/DataContext';
import { enhanceColorPalette } from '../lib/color-enhancement';
import { ColorSwatch } from '../components/ui/color-swatch';
import {
  exportFigmaTokens,
  exportCSSVariables,
  exportTailwindConfig,
  getBestTextColor,
} from '../lib/color-utils';
import { toast } from 'sonner';

type StyleGuideType = 'business' | 'app';

interface ColorItem {
  name: string;
  hex: string;
  usage: string;
  rgb?: { r: number; g: number; b: number };
  hsl?: { h: number; s: number; l: number };
  accessibility?: {
    contrastWithWhite: number;
    contrastWithBlack: number;
    wcagAA: boolean;
    wcagAAA: boolean;
    wcagAALarge: boolean;
    wcagAAALarge: boolean;
  };
  tokenName?: string;
}

interface TypographyItem {
  font: string;
  usage: string[];
  description: string;
}

interface StyleGuideData {
  type: StyleGuideType;
  title: string;
  subtitle: string;
  colors: ColorItem[];
  typography: {
    primary: TypographyItem;
    secondary: TypographyItem;
  };
  lastUpdated: string;
}

export function StyleGuidePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { businesses, appConcepts } = useData();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') as 'business' | 'app' | null;
  const [showAccessibility, setShowAccessibility] = useState(false);

  // Get data based on type
  const getStyleGuideData = (): StyleGuideData | null => {
    if (type === 'business') {
      const business = businesses.find((b) => b.id === id);
      if (!business) return null;

      // Enhance color palette with accessibility data
      const enhancedPalette = business.colorPalette
        ? enhanceColorPalette(business.colorPalette, business.companyName, 'business')
        : null;

      return {
        type: 'business',
        title: business.companyName,
        subtitle: business.tagline,
        colors: [
          {
            name: 'Primary',
            hex: enhancedPalette?.primary.hex || '#000000',
            usage: enhancedPalette?.primary.usage || '',
            rgb: enhancedPalette?.primary.rgb,
            hsl: enhancedPalette?.primary.hsl,
            accessibility: enhancedPalette?.primary.accessibility,
            tokenName: enhancedPalette?.primary.tokenName,
          },
          {
            name: 'Secondary',
            hex: enhancedPalette?.secondary.hex || '#000000',
            usage: enhancedPalette?.secondary.usage || '',
            rgb: enhancedPalette?.secondary.rgb,
            hsl: enhancedPalette?.secondary.hsl,
            accessibility: enhancedPalette?.secondary.accessibility,
            tokenName: enhancedPalette?.secondary.tokenName,
          },
          {
            name: 'Accent',
            hex: enhancedPalette?.accent.hex || '#000000',
            usage: enhancedPalette?.accent.usage || '',
            rgb: enhancedPalette?.accent.rgb,
            hsl: enhancedPalette?.accent.hsl,
            accessibility: enhancedPalette?.accent.accessibility,
            tokenName: enhancedPalette?.accent.tokenName,
          },
          {
            name: 'Background',
            hex: enhancedPalette?.background.hex || '#FFFFFF',
            usage: enhancedPalette?.background.usage || '',
            rgb: enhancedPalette?.background.rgb,
            hsl: enhancedPalette?.background.hsl,
            accessibility: enhancedPalette?.background.accessibility,
            tokenName: enhancedPalette?.background.tokenName,
          },
          ...(enhancedPalette?.customColors?.map((c) => ({
            name: c.name,
            hex: c.hex,
            usage: c.usage,
            rgb: (c as any).rgb,
            hsl: (c as any).hsl,
            accessibility: (c as any).accessibility,
            tokenName: (c as any).tokenName,
          })) || []),
        ],
        typography: {
          primary: {
            font: business.typography?.primaryFont.font || 'EB Garamond',
            usage: business.typography?.primaryFont.usage || ['Headings', 'Hero text'],
            description: business.typography?.primaryFont.whyItWorks || 'For headings and display text',
          },
          secondary: {
            font: business.typography?.secondaryFont.font || 'Lato',
            usage: business.typography?.secondaryFont.usage || ['Body text', 'UI elements'],
            description: business.typography?.secondaryFont.whyItWorks || 'For body copy and UI elements',
          },
        },
        lastUpdated: new Date(business.updatedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };
    } else if (type === 'app') {
      const app = appConcepts.find((a) => a.id === id);
      if (!app) return null;

      // Get business for fallback values
      const business = businesses.find((b) => b.id === app.businessId);
      
      // Create a temporary color palette for the app
      const appPalette = {
        primary: { hex: app.primaryColor || business?.colorPalette?.primary.hex || '#000000', usage: 'Primary actions, buttons, links' },
        secondary: { hex: app.secondaryColor || business?.colorPalette?.secondary.hex || '#000000', usage: 'Secondary elements, borders' },
        accent: { hex: app.accentColor || business?.colorPalette?.accent.hex || '#000000', usage: 'Highlights, badges, alerts' },
        background: { hex: app.backgroundColor || business?.colorPalette?.background.hex || '#FFFFFF', usage: 'Page backgrounds, cards' },
      };
      
      const enhancedPalette = enhanceColorPalette(appPalette, app.appNamePublished || app.appNameInternal, 'app');

      return {
        type: 'app',
        title: app.appNamePublished || app.appNameInternal,
        subtitle: app.description,
        colors: [
          {
            name: 'Primary',
            hex: enhancedPalette.primary.hex,
            usage: enhancedPalette.primary.usage,
            rgb: enhancedPalette.primary.rgb,
            hsl: enhancedPalette.primary.hsl,
            accessibility: enhancedPalette.primary.accessibility,
            tokenName: enhancedPalette.primary.tokenName,
          },
          {
            name: 'Secondary',
            hex: enhancedPalette.secondary.hex,
            usage: enhancedPalette.secondary.usage,
            rgb: enhancedPalette.secondary.rgb,
            hsl: enhancedPalette.secondary.hsl,
            accessibility: enhancedPalette.secondary.accessibility,
            tokenName: enhancedPalette.secondary.tokenName,
          },
          {
            name: 'Accent',
            hex: enhancedPalette.accent.hex,
            usage: enhancedPalette.accent.usage,
            rgb: enhancedPalette.accent.rgb,
            hsl: enhancedPalette.accent.hsl,
            accessibility: enhancedPalette.accent.accessibility,
            tokenName: enhancedPalette.accent.tokenName,
          },
          {
            name: 'Background',
            hex: enhancedPalette.background.hex,
            usage: enhancedPalette.background.usage,
            rgb: enhancedPalette.background.rgb,
            hsl: enhancedPalette.background.hsl,
            accessibility: enhancedPalette.background.accessibility,
            tokenName: enhancedPalette.background.tokenName,
          },
        ],
        typography: {
          primary: {
            font: business?.typography?.primaryFont.font || 'EB Garamond',
            usage: business?.typography?.primaryFont.usage || ['Headings', 'Hero text'],
            description: business?.typography?.primaryFont.whyItWorks || 'For headings and display text',
          },
          secondary: {
            font: business?.typography?.secondaryFont.font || 'Lato',
            usage: business?.typography?.secondaryFont.usage || ['Body text', 'UI elements'],
            description: business?.typography?.secondaryFont.whyItWorks || 'For body copy and UI elements',
          },
        },
        lastUpdated: new Date(app.updatedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };
    }

    return null;
  };

  const data = getStyleGuideData();

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Style Guide Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The requested style guide could not be loaded.
          </p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleExportFigmaTokens = () => {
    const tokens = exportFigmaTokens(data.colors, data.title, data.type);
    const blob = new Blob([JSON.stringify(tokens, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.title.toLowerCase().replace(/\s+/g, '-')}-figma-tokens.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCSS = () => {
    const css = exportCSSVariables(data.colors, data.title, data.type);
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.title.toLowerCase().replace(/\s+/g, '-')}-colors.css`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportTailwind = () => {
    const config = exportTailwindConfig(data.colors, data.title);
    const content = `// Tailwind color configuration for ${data.title}\nmodule.exports = ${JSON.stringify(config, null, 2)};`;
    const blob = new Blob([content], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.title.toLowerCase().replace(/\s+/g, '-')}-tailwind.js`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-8 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400 mb-6">
            <Link to="/" className="hover:text-gray-600">
              Home
            </Link>
            <span>›</span>
            <Link
              to={data.type === 'business' ? '/business-hub' : '/app-incubator'}
              className="hover:text-gray-600"
            >
              {data.type === 'business' ? 'Business DNA' : 'App Incubator'}
            </Link>
            <span>›</span>
            <Link
              to={
                data.type === 'business'
                  ? `/business-hub/${id}`
                  : `/app-incubator/${id}`
              }
              className="hover:text-gray-600"
            >
              {data.title}
            </Link>
            <span>›</span>
            <span className="text-gray-600">Style Guide</span>
          </div>

          {/* Title and Actions */}
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-headline tracking-tight mb-2">
                Style Guide
              </h1>
              <p className="text-sm text-gray-500">{data.subtitle}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Export as</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleExportFigmaTokens}>
                    Figma Tokens
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportCSS}>
                    CSS Variables
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportTailwind}>
                    Tailwind Config
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 py-16 space-y-24">
        {/* Color Palette Section */}
        <section>
          <div className="mb-8">
            <p className="text-sm font-medium text-gray-500 tracking-widest uppercase mb-7">
              01
            </p>
            <h2 className="text-3xl font-headline mb-4">Color Palette</h2>
            <div className="h-1 w-16 bg-gray-300 rounded-full mb-7" />
            <div className="flex items-start justify-between">
              <p className="text-sm text-gray-600 max-w-2xl">
                The foundational colors that define the visual identity. Each
                color has been tested for accessibility compliance.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAccessibility(!showAccessibility)}
              >
                {showAccessibility ? (
                  <X className="h-4 w-4 mr-2" />
                ) : (
                  <Check className="h-4 w-4 mr-2" />
                )}
                Show Accessibility
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm p-8">
            <div className="grid grid-cols-4 gap-8">
              {data.colors.map((color) => (
                <div key={color.name} className="space-y-4">
                  <button
                    onClick={() => copyToClipboard(color.hex)}
                    className="w-full h-[133px] rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                    style={{ backgroundColor: color.hex }}
                    title={`Click to copy ${color.hex}`}
                  />
                  <div>
                    <p className="text-sm font-medium mb-1">{color.name}</p>
                    <p className="text-xs font-mono text-gray-500">
                      {color.hex.toUpperCase()}
                    </p>
                    {color.usage && (
                      <p className="text-xs text-gray-400 mt-2">
                        {color.usage}
                      </p>
                    )}
                    {showAccessibility && color.accessibility && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-400">
                          Contrast with white: {color.accessibility.contrastWithWhite.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400">
                          Contrast with black: {color.accessibility.contrastWithBlack.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400">
                          WCAG AA: {color.accessibility.wcagAA ? 'Pass' : 'Fail'}
                        </p>
                        <p className="text-xs text-gray-400">
                          WCAG AAA: {color.accessibility.wcagAAA ? 'Pass' : 'Fail'}
                        </p>
                        <p className="text-xs text-gray-400">
                          WCAG AA Large: {color.accessibility.wcagAALarge ? 'Pass' : 'Fail'}
                        </p>
                        <p className="text-xs text-gray-400">
                          WCAG AAA Large: {color.accessibility.wcagAAALarge ? 'Pass' : 'Fail'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs italic text-gray-400 mt-4">
            Click any color to copy its hex value
          </p>
        </section>

        {/* Typography Section */}
        <section>
          <div className="mb-8">
            <p className="text-sm font-medium text-gray-500 tracking-widest uppercase mb-7">
              02
            </p>
            <h2 className="text-3xl font-headline mb-4">Typography</h2>
            <div className="h-1 w-16 bg-gray-300 rounded-full mb-7" />
            <p className="text-sm text-gray-600">
              Type system built on two complementary typefaces for hierarchy and
              readability.
            </p>
          </div>

          {/* Typography Samples */}
          <div className="bg-white rounded-3xl shadow-sm p-12 space-y-8 mb-8">
            <h1
              className="text-5xl font-headline"
              style={{ fontFamily: data.typography.primary.font }}
            >
              H1: Main Heading
            </h1>
            <h2
              className="text-3xl font-headline"
              style={{ fontFamily: data.typography.primary.font }}
            >
              H2: Section Heading
            </h2>
            <h3
              className="text-xl font-headline font-medium"
              style={{ fontFamily: data.typography.primary.font }}
            >
              H3: Sub-heading
            </h3>
            <p
              className="text-base leading-relaxed text-gray-700 max-w-3xl"
              style={{ fontFamily: data.typography.secondary.font }}
            >
              Body text uses {data.typography.secondary.font} for optimal
              readability. This paragraph demonstrates the standard font
              treatment for content and descriptions. The spacing and sizing
              have been carefully considered for comfortable reading.
            </p>
            <div className="flex items-center gap-4">
              <Button
                style={{
                  backgroundColor: data.colors[0].hex,
                  fontFamily: data.typography.secondary.font,
                }}
              >
                Primary Button
              </Button>
              <Badge
                variant="secondary"
                style={{ fontFamily: data.typography.secondary.font }}
              >
                Label Text
              </Badge>
            </div>
          </div>

          {/* Font Details */}
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <p className="text-xs font-medium text-gray-500 tracking-widest uppercase mb-6">
                Primary Typeface
              </p>
              <h3
                className="text-3xl font-headline mb-6"
                style={{ fontFamily: data.typography.primary.font }}
              >
                {data.typography.primary.font}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {data.typography.primary.description}
              </p>
              <p className="text-xs font-mono text-gray-500">
                {data.typography.primary.usage.join(', ')}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8">
              <p className="text-xs font-medium text-gray-500 tracking-widest uppercase mb-6">
                Secondary Typeface
              </p>
              <h3
                className="text-3xl"
                style={{ fontFamily: data.typography.secondary.font }}
              >
                {data.typography.secondary.font}
              </h3>
              <p className="text-sm text-gray-600 mb-4 mt-6">
                {data.typography.secondary.description}
              </p>
              <p className="text-xs font-mono text-gray-500">
                {data.typography.secondary.usage.join(', ')}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="border-t">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <p className="text-xs text-gray-400">
            Last updated: {data.lastUpdated}
          </p>
        </div>
      </div>
    </div>
  );
}