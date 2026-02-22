// Color utilities for Figma design system integration

export interface ColorRGB {
  r: number; // 0-255
  g: number;
  b: number;
}

export interface ColorHSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface ColorAccessibility {
  contrastWithWhite: number;
  contrastWithBlack: number;
  wcagAA: boolean;
  wcagAAA: boolean;
  wcagAALarge: boolean;
  wcagAAALarge: boolean;
}

export interface FigmaColor {
  r: number; // 0-1 (Figma format)
  g: number; // 0-1
  b: number; // 0-1
  a: number; // 0-1
}

// Convert hex to RGB (0-255)
export function hexToRgb(hex: string): ColorRGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Convert RGB to HSL
export function rgbToHsl(rgb: ColorRGB): ColorHSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// Convert hex to Figma color format (0-1 range)
export function hexToFigma(hex: string): FigmaColor | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  return {
    r: rgb.r / 255,
    g: rgb.g / 255,
    b: rgb.b / 255,
    a: 1,
  };
}

// Calculate relative luminance for WCAG contrast
function getLuminance(rgb: ColorRGB): number {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
    const v = val / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Calculate contrast ratio between two colors
export function getContrastRatio(color1: ColorRGB, color2: ColorRGB): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

// Get accessibility information for a color
export function getAccessibilityInfo(hex: string): ColorAccessibility | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const white: ColorRGB = { r: 255, g: 255, b: 255 };
  const black: ColorRGB = { r: 0, g: 0, b: 0 };

  const contrastWithWhite = getContrastRatio(rgb, white);
  const contrastWithBlack = getContrastRatio(rgb, black);

  return {
    contrastWithWhite,
    contrastWithBlack,
    wcagAA: contrastWithBlack >= 4.5 || contrastWithWhite >= 4.5,
    wcagAAA: contrastWithBlack >= 7 || contrastWithWhite >= 7,
    wcagAALarge: contrastWithBlack >= 3 || contrastWithWhite >= 3,
    wcagAAALarge: contrastWithBlack >= 4.5 || contrastWithWhite >= 4.5,
  };
}

// Generate Figma-compatible token name
export function generateTokenName(
  type: 'business' | 'app',
  entityName: string,
  colorName: string
): string {
  const sanitizedEntity = entityName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const sanitizedColor = colorName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `${type}/${sanitizedEntity}/${sanitizedColor}`;
}

// Export colors in Figma Tokens format (popular plugin)
export function exportFigmaTokens(colors: Array<{
  name: string;
  hex: string;
  usage: string;
}>, entityName: string, type: 'business' | 'app') {
  const tokens: Record<string, any> = {};

  colors.forEach((color) => {
    const tokenName = generateTokenName(type, entityName, color.name);
    const rgb = hexToRgb(color.hex);
    const hsl = rgb ? rgbToHsl(rgb) : null;

    tokens[tokenName] = {
      value: color.hex,
      type: 'color',
      description: color.usage,
      ...(rgb && {
        $extensions: {
          'studio.tokens': {
            modify: {
              type: 'lighten',
              value: '0',
              space: 'hsl',
            },
          },
        },
        rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        hsl: hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : undefined,
      }),
    };
  });

  return {
    [type]: tokens,
    $metadata: {
      tokenSetOrder: [type],
    },
  };
}

// Export as CSS custom properties
export function exportCSSVariables(colors: Array<{
  name: string;
  hex: string;
}>, entityName: string, type: 'business' | 'app'): string {
  const sanitizedEntity = entityName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  let css = `:root {\n  /* ${type}: ${entityName} */\n`;

  colors.forEach((color) => {
    const varName = `--${type}-${sanitizedEntity}-${color.name
      .toLowerCase()
      .replace(/\s+/g, '-')}`;
    const rgb = hexToRgb(color.hex);

    css += `  ${varName}: ${color.hex};\n`;
    if (rgb) {
      css += `  ${varName}-rgb: ${rgb.r}, ${rgb.g}, ${rgb.b};\n`;
    }
  });

  css += '}\n';
  return css;
}

// Export for Tailwind config
export function exportTailwindConfig(colors: Array<{
  name: string;
  hex: string;
}>, entityName: string): Record<string, string> {
  const config: Record<string, string> = {};

  colors.forEach((color) => {
    const key = color.name.toLowerCase().replace(/\s+/g, '-');
    config[key] = color.hex;
  });

  return config;
}

// Get best text color (black or white) for background
export function getBestTextColor(backgroundHex: string): '#000000' | '#FFFFFF' {
  const rgb = hexToRgb(backgroundHex);
  if (!rgb) return '#000000';

  const white: ColorRGB = { r: 255, g: 255, b: 255 };
  const black: ColorRGB = { r: 0, g: 0, b: 0 };

  const contrastWithWhite = getContrastRatio(rgb, white);
  const contrastWithBlack = getContrastRatio(rgb, black);

  return contrastWithWhite > contrastWithBlack ? '#FFFFFF' : '#000000';
}

// Generate color variations (tints and shades)
export function generateColorScale(hex: string, steps: number = 9): string[] {
  const rgb = hexToRgb(hex);
  if (!rgb) return [hex];

  const hsl = rgbToHsl(rgb);
  const scale: string[] = [];

  // Generate lighter and darker versions
  for (let i = 0; i < steps; i++) {
    const lightnessFactor = (i / (steps - 1)) * 100;
    const newL = lightnessFactor;

    const h = hsl.h;
    const s = hsl.s;

    // Convert back to RGB
    const c = (1 - Math.abs(2 * newL / 100 - 1)) * s / 100;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = newL / 100 - c / 2;

    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) {
      r = c; g = x; b = 0;
    } else if (h >= 60 && h < 120) {
      r = x; g = c; b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0; g = c; b = x;
    } else if (h >= 180 && h < 240) {
      r = 0; g = x; b = c;
    } else if (h >= 240 && h < 300) {
      r = x; g = 0; b = c;
    } else {
      r = c; g = 0; b = x;
    }

    const rFinal = Math.round((r + m) * 255);
    const gFinal = Math.round((g + m) * 255);
    const bFinal = Math.round((b + m) * 255);

    const hexValue = `#${[rFinal, gFinal, bFinal]
      .map(v => v.toString(16).padStart(2, '0'))
      .join('')}`;

    scale.push(hexValue);
  }

  return scale;
}
