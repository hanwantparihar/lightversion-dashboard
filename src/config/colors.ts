/**
 * ─── Brand Color Configuration ────────────────────────────────────────────────
 *
 * SINGLE SOURCE OF TRUTH for all brand and semantic colors.
 *
 * To change the primary color (or any other):
 *  1. Update the hex value in BRAND_COLORS below.
 *  2. Save the file — nothing else needs changing.
 *
 * How it works:
 *  - generateBrandCssVars() converts the hex values to HSL and builds a <style>
 *    block that is injected into the document by layout.tsx.
 *  - globals.css only holds structural / neutral variables (background, border…).
 *  - tailwind.config.ts maps tokens (bg-primary, text-success…) to the CSS vars.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Hex → HSL conversion ─────────────────────────────────────────────────────

function hexToHslString(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return `0 0% ${Math.round(l * 100)}%`;

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let hue = 0;
  if (max === r) hue = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) hue = (b - r) / d + 2;
  else hue = (r - g) / d + 4;

  return `${Math.round(hue * 60)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

// ── Color definitions ─────────────────────────────────────────────────────────
// ↓↓↓  Change hex values here to rebrand the entire dashboard  ↓↓↓

export const BRAND_COLORS = {
  // Primary brand colour — used in sidebar, buttons, focus rings, links
  primary:           "#2563eb",
  primaryDark:       "#3b82f6",  // Lighter shade shown in dark mode
  primaryForeground: "#ffffff",

  // Semantic colours
  success:           "#10b981",
  successForeground: "#ffffff",

  warning:           "#f59e0b",
  warningForeground: "#ffffff",

  danger:            "#ef4444",  // Also controls the Tailwind `destructive` token
  dangerForeground:  "#ffffff",

  info:              "#06b6d4",
  infoForeground:    "#ffffff",
} as const;

export type BrandColorKey = keyof typeof BRAND_COLORS;

// ── CSS variable generator ────────────────────────────────────────────────────
// Called by layout.tsx to produce a <style> tag injected into every page.

export function generateBrandCssVars(): string {
  const c = BRAND_COLORS;

  return `
    :root {
      --primary:              ${hexToHslString(c.primary)};
      --primary-foreground:   ${hexToHslString(c.primaryForeground)};
      --success:              ${hexToHslString(c.success)};
      --success-foreground:   ${hexToHslString(c.successForeground)};
      --warning:              ${hexToHslString(c.warning)};
      --warning-foreground:   ${hexToHslString(c.warningForeground)};
      --destructive:          ${hexToHslString(c.danger)};
      --destructive-foreground: ${hexToHslString(c.dangerForeground)};
      --info:                 ${hexToHslString(c.info)};
      --info-foreground:      ${hexToHslString(c.infoForeground)};
    }
    .dark {
      --primary:              ${hexToHslString(c.primaryDark)};
      --primary-foreground:   ${hexToHslString(c.primaryForeground)};
    }
  `.trim();
}
