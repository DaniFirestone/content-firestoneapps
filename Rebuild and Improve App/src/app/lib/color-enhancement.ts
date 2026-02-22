// Utility to enhance color data with Figma-compatible metadata
import type { ColorInfo, ColorPalette, CustomColor } from './mock-data';
import {
  hexToRgb,
  rgbToHsl,
  hexToFigma,
  getAccessibilityInfo,
  generateTokenName,
} from './color-utils';

export function enhanceColorInfo(
  colorHex: string,
  usage: string,
  tokenName?: string
): ColorInfo {
  const rgb = hexToRgb(colorHex);
  const hsl = rgb ? rgbToHsl(rgb) : undefined;
  const figma = hexToFigma(colorHex);
  const accessibility = getAccessibilityInfo(colorHex);

  return {
    hex: colorHex,
    usage,
    rgb,
    hsl,
    figma: figma || undefined,
    accessibility: accessibility || undefined,
    tokenName,
  };
}

export function enhanceColorPalette(
  palette: ColorPalette,
  entityName: string,
  type: 'business' | 'app'
): ColorPalette {
  return {
    primary: enhanceColorInfo(
      palette.primary.hex,
      palette.primary.usage,
      generateTokenName(type, entityName, 'primary')
    ),
    secondary: enhanceColorInfo(
      palette.secondary.hex,
      palette.secondary.usage,
      generateTokenName(type, entityName, 'secondary')
    ),
    accent: enhanceColorInfo(
      palette.accent.hex,
      palette.accent.usage,
      generateTokenName(type, entityName, 'accent')
    ),
    background: enhanceColorInfo(
      palette.background.hex,
      palette.background.usage,
      generateTokenName(type, entityName, 'background')
    ),
    customColors: palette.customColors?.map((c) => ({
      ...c,
      ...enhanceColorInfo(c.hex, c.usage, generateTokenName(type, entityName, c.name)),
    })),
  };
}
