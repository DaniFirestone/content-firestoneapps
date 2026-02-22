# Figma Design System Bridge

This implementation creates a comprehensive bridge between the Content Hub's color system and Figma's design system standards. It enhances color data with metadata that Figma expects while maintaining backward compatibility with the existing system.

## Features

### 1. **Enhanced Color Data Structure**

Every color now includes:
- **Hex values** - Standard format (#RRGGBB)
- **RGB values** - 0-255 range for CSS
- **HSL values** - Hue, Saturation, Lightness
- **Figma color format** - 0-1 range (native Figma format)
- **Accessibility metrics** - WCAG contrast ratios and compliance levels
- **Token names** - Figma-compatible semantic naming

### 2. **Accessibility Validation**

All colors are automatically analyzed for:
- Contrast ratio with white and black backgrounds
- WCAG AA compliance (4.5:1 for normal text)
- WCAG AAA compliance (7:1 for normal text)
- Large text compliance (3:1 for AA, 4.5:1 for AAA)

### 3. **Export Formats**

The Style Guide page now supports exporting colors in multiple formats:

#### **Figma Tokens JSON**
Compatible with the popular [Figma Tokens](https://www.figma.com/community/plugin/843461159747178978/Figma-Tokens) plugin. Includes:
- Semantic token naming (business/entity-name/color-name)
- RGB and HSL values
- Usage descriptions
- Token set ordering

Example output:
```json
{
  "business": {
    "business/firestone-creative/primary": {
      "value": "#6C3CE1",
      "type": "color",
      "description": "Buttons, links, primary actions",
      "rgb": "rgb(108, 60, 225)",
      "hsl": "hsl(258, 73%, 56%)"
    }
  }
}
```

#### **CSS Custom Properties**
Ready-to-use CSS variables:
```css
:root {
  /* business: Firestone Creative */
  --business-firestone-creative-primary: #6C3CE1;
  --business-firestone-creative-primary-rgb: 108, 60, 225;
}
```

#### **Tailwind Config**
Direct integration with Tailwind CSS:
```javascript
module.exports = {
  "primary": "#6C3CE1",
  "secondary": "#1A1A2E",
  "accent": "#F5A623"
};
```

### 4. **Interactive Accessibility Display**

The Style Guide includes a toggle to show/hide accessibility information for each color:
- Contrast ratios
- WCAG compliance badges
- Best practices for text usage

## Implementation Details

### Color Utilities (`/src/app/lib/color-utils.ts`)

Core functions for color manipulation and export:

- `hexToRgb()` - Convert hex to RGB (0-255)
- `rgbToHsl()` - Convert RGB to HSL
- `hexToFigma()` - Convert hex to Figma format (0-1)
- `getContrastRatio()` - Calculate WCAG contrast ratio
- `getAccessibilityInfo()` - Get complete accessibility analysis
- `generateTokenName()` - Create Figma-compatible token names
- `exportFigmaTokens()` - Export in Figma Tokens format
- `exportCSSVariables()` - Export as CSS custom properties
- `exportTailwindConfig()` - Export for Tailwind CSS
- `getBestTextColor()` - Determine optimal text color (black/white)
- `generateColorScale()` - Create tints and shades

### Color Enhancement (`/src/app/lib/color-enhancement.ts`)

Utilities to enhance existing color data with Figma metadata:

- `enhanceColorInfo()` - Add metadata to a single color
- `enhanceColorPalette()` - Process entire color palette

### Data Structure

The `ColorInfo` interface now includes optional Figma-compatible fields:

```typescript
export interface ColorInfo {
  hex: string;
  usage: string;
  // Enhanced metadata for Figma integration
  rgb?: ColorRGB;
  hsl?: ColorHSL;
  figma?: FigmaColor;
  accessibility?: ColorAccessibility;
  tokenName?: string;
}
```

## Usage

### In the Style Guide

1. Navigate to any Business Hub or App's Style Guide
2. Click the "Show Accessibility" button to view contrast ratios and WCAG compliance
3. Click the "Export" dropdown to download colors in your preferred format

### Programmatically

```typescript
import { enhanceColorPalette } from './lib/color-enhancement';
import { exportFigmaTokens } from './lib/color-utils';

// Enhance a color palette
const enhanced = enhanceColorPalette(
  business.colorPalette,
  business.companyName,
  'business'
);

// Export to Figma Tokens
const tokens = exportFigmaTokens(
  colors,
  'Firestone Creative',
  'business'
);
```

## Workflow: Content Hub → Figma

1. **Define colors** in the Content Hub (Business DNA or App settings)
2. **View the Style Guide** to see enhanced color information and accessibility metrics
3. **Export** in your preferred format (Figma Tokens, CSS, or Tailwind)
4. **Import to Figma** using the Figma Tokens plugin or manually create color styles
5. **Sync** - Any updates in Content Hub can be re-exported and re-imported

## Benefits

- **Consistency** - Single source of truth for brand colors
- **Accessibility** - Built-in WCAG compliance checking
- **Interoperability** - Export to multiple design/dev tools
- **Automation** - Automatic metadata generation
- **Semantic naming** - Clear token hierarchy
- **Backward compatible** - Existing code continues to work

## Future Enhancements

Potential improvements:
- Direct Figma API integration for two-way sync
- Color scale generation (50-900 shades)
- Dark mode color variants
- Component-level color tokens
- Typography token export
- Spacing/sizing token export
- Animation token export
- Live preview with actual Figma components
