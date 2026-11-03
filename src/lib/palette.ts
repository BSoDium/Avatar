import chroma from "chroma-js";
import type { Colors } from "@/assets/Model";

/**
 * Color generation and accessibility rules.
 *
 * The model has fixed black outlines and a white collar and glasses; every other color is
 * generated in OKLCH (perceptually uniform, so lightness is predictable) and its lightness is
 * then fitted so that the contrast rules below hold against the colors it touches.
 */

export type Palette = Colors;
export type PaletteKey = keyof Palette;

const BLACK = "#000000";
const WHITE = "#ffffff";

/** Below this luminance a background is considered dark */
const DARK_LUMINANCE = 0.18;

export const isDark = (color: string) => chroma(color).luminance() < DARK_LUMINANCE;

export interface Rule {
  title: string;
  message: string;
  a: string;
  b: string;
  /** Under this contrast ratio, the palette is flagged */
  min: number;
  /** The contrast ratio the generator aims for, to leave some margin */
  target: number;
}

export function rules(p: Palette): Rule[] {
  const dark = isDark(p.background);
  return [
    {
      title: "Low contrast: outlines",
      message: "Skin color is too dark for the black outlines of the face",
      a: p.tonal,
      b: BLACK,
      min: 7,
      target: 8,
    },
    {
      title: "Low contrast: glasses",
      message: "Skin color is too bright for the white glasses",
      a: p.tonal,
      b: WHITE,
      min: 1.5,
      target: 1.8,
    },
    {
      title: "Low contrast: hair",
      message: "Hair color doesn't have enough contrast with the skin",
      a: p.hair,
      b: p.tonal,
      min: 3,
      target: 4,
    },
    {
      title: "Low contrast: skin",
      message: "Skin color doesn't have enough contrast with the background",
      a: p.tonal,
      b: p.background,
      min: dark ? 3 : 1.5,
      target: dark ? 4 : 1.7,
    },
    {
      title: "Low contrast: hair",
      message: "Hair color doesn't have enough contrast with the background",
      a: p.hair,
      b: p.background,
      min: 1.3,
      target: 1.5,
    },
    {
      title: "Low contrast: jacket",
      message: "Jacket color doesn't have enough contrast with the background",
      a: p.secondary,
      b: p.background,
      min: 1.3,
      target: 1.5,
    },
    {
      title: "Low contrast: jacket",
      message: "Jacket color doesn't have enough contrast with the skin",
      a: p.secondary,
      b: p.tonal,
      min: 1.3,
      target: 1.5,
    },
    {
      title: "Low contrast: jacket",
      message: "Jacket color doesn't have enough contrast with the shirt",
      a: p.secondary,
      b: p.primary,
      min: 1.5,
      target: 2,
    },
    {
      title: "Low contrast: shirt",
      message: "Shirt color doesn't have enough contrast with the skin",
      a: p.primary,
      b: p.tonal,
      min: 1.3,
      target: 1.5,
    },
    {
      title: "Low contrast: shirt",
      message: "Shirt color doesn't have enough contrast with the white collar",
      a: p.primary,
      b: WHITE,
      min: 1.5,
      target: 2,
    },
  ];
}

/** Rules a palette breaks */
export function violations(p: Palette) {
  return rules(p).filter((rule) => chroma.contrast(rule.a, rule.b) < rule.min);
}

interface Constraint {
  color: string;
  target: number;
}

/**
 * Build the color with the given hue and chroma whose lightness is the closest to the preferred
 * one while meeting every constraint (or, when that is impossible, the one that comes closest).
 * Chroma is reduced where needed to stay in the sRGB gamut.
 */
function fit(
  hue: number,
  wantedChroma: number,
  preferredLightness: number,
  constraints: Constraint[]
) {
  let best: { color: string; score: number; distance: number } | null = null;

  for (let step = 0; step <= 200; step++) {
    const lightness = step / 200;
    let c = wantedChroma;
    let color = chroma.oklch(lightness, c, hue);
    while (color.clipped() && c > 0) {
      c = Math.max(c - 0.005, 0);
      color = chroma.oklch(lightness, c, hue);
    }

    // Worst contrast relative to its target, capped so that margin beyond it doesn't count
    const score = Math.min(
      1,
      ...constraints.map(
        (constraint) => chroma.contrast(color, constraint.color) / constraint.target
      )
    );
    const distance = Math.abs(lightness - preferredLightness);

    if (
      !best ||
      score > best.score + 1e-9 ||
      (Math.abs(score - best.score) <= 1e-9 && distance < best.distance)
    ) {
      best = { color: color.hex(), score, distance };
    }
  }

  return best!.color;
}

const hueOf = (color: string) => {
  const hue = chroma(color).oklch()[2];
  return Number.isNaN(hue) ? 0 : hue;
};

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

/** Hue offsets of the jacket relative to the shirt: analogous, split and complementary */
const harmonies = [-15, 15, -40, 40, 150, 180, -150];

/** Natural hair colors that stay readable on every skin color we generate */
export const hairColors = ["#000000", "#2B1B14", "#3B2314", "#5A3825", "#6B2D17"];

/**
 * A random shirt color: vivid but not neon, bright enough for the white collar to show.
 */
export function randomPrimary() {
  return fit(rand(0, 360), rand(0.09, 0.16), rand(0.58, 0.78), [
    { color: WHITE, target: 2 },
  ]);
}

/**
 * Generate the colors that are not locked out of the shirt color, so that the palette follows
 * the accessibility rules. The shirt itself is never modified.
 * @param palette the current palette
 * @param locked the colors to leave as they are
 * @param dark whether to generate a dark background
 * @param jitter vary the result instead of returning the same palette every time
 */
export function complete(
  palette: Palette,
  locked: Partial<Record<PaletteKey, boolean>>,
  dark: boolean,
  jitter = false
): Palette {
  const result = { ...palette };
  const hue = hueOf(palette.primary);
  const j = (amount: number) => (jitter ? rand(-amount, amount) : 0);
  const harmony = jitter
    ? harmonies[Math.floor(Math.random() * harmonies.length)]
    : harmonies[0];

  if (!locked.tonal) {
    result.tonal = fit(hue, 0.08 + j(0.02), (dark ? 0.79 : 0.74) + j(0.04), [
      { color: BLACK, target: 8 },
      { color: WHITE, target: 1.8 },
      { color: result.hair, target: 4 },
      { color: result.primary, target: 1.5 },
    ]);
  }

  if (!locked.background) {
    const skinTarget = dark ? 4 : 1.7;
    result.background = fit(
      hue + harmony / 3,
      (dark ? 0.04 : 0.035) + j(0.015),
      (dark ? 0.3 : 0.94) + j(0.03),
      [
        { color: result.tonal, target: skinTarget },
        { color: result.hair, target: 1.5 },
        // not pure white
        ...(dark ? [] : [{ color: WHITE, target: 1.1 }]),
      ]
    );
  }

  if (!locked.secondary) {
    result.secondary = fit(
      hue + harmony,
      0.1 + j(0.03),
      (dark ? 0.4 : 0.45) + j(0.04),
      [
        { color: result.background, target: 1.5 },
        { color: result.tonal, target: 1.5 },
        { color: result.primary, target: 2 },
      ]
    );
  }

  return result;
}
