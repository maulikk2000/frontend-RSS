import { AnalysisValue } from "./ModelData";

export type Colour = [number, number, number];

export type ColourFunction = (v: AnalysisValue, min: AnalysisValue, max: AnalysisValue) => Colour;

const lerp = (a: number, b: number, t: number) => a + t * (b - a);
const lerpColour = (c1: Colour, c2: Colour, t: number): Colour => [
  lerp(c1[0], c2[0], t),
  lerp(c1[1], c2[1], t),
  lerp(c1[2], c2[1], t)
];

export const colourGradient = (minColour: Colour, maxColour: Colour, nullColour: Colour): ColourFunction => (
  v,
  min,
  max
) => {
  if (v === null || min === null || max === null) {
    return nullColour;
  }

  const t = Math.max(Math.min((v - min) / (max - min), 1), 0);
  return lerpColour(minColour, maxColour, t);
};

export const multiColourGradient = (
  minValue: number | undefined,
  maxValue: number | undefined,
  colours: Colour[],
  nullColour: Colour
): ColourFunction => (v) => {
  if (v == null || minValue == null || maxValue == null) {
    return nullColour;
  }

  if (v === minValue) {
    return colours[0];
  }

  if (v === maxValue) {
    return colours[colours.length - 1];
  }

  const stepSize = (maxValue - minValue) / (colours.length - 1);
  const step = Math.floor((v - minValue) / stepSize);

  const stepMinValue = minValue + step * stepSize;
  const stepMaxValue = minValue + (step + 1) * stepSize;
  const minColour = colours[step];
  const maxColour = colours[step + 1];

  const t = Math.max(Math.min((v - stepMinValue) / (stepMaxValue - stepMinValue), 1), 0);
  return lerpColour(minColour, maxColour, t);
};

export type ColourStep = { below: number; colour: Colour };

export const colourSteps = (steps: ColourStep[], nullColour: Colour): ColourFunction => (v) => {
  if (v === null) {
    return nullColour;
  }
  const step = steps.reduce(
    (acc, x) => {
      if (v <= x.below && x.below < acc.below) {
        return x;
      }
      return acc;
    },
    { below: Number.POSITIVE_INFINITY, colour: nullColour }
  );
  return step.colour;
};
