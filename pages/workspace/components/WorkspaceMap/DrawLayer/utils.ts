import type { Position } from "@nebula.gl/edit-modes";
import turfDistance from "@turf/distance";
import { Measurement } from "types/workspace";
import { defaultMeasurementUnit, FormattingEnum } from "utils/constants";

type ModeConfigWithMeasurement = { measurement?: Measurement };

export const calculateDistanceForTooltip = (
  positionA: Position,
  positionB: Position,
  modeConfig?: ModeConfigWithMeasurement
): number => {
  const lengthUnit = getLengthUnit(modeConfig);

  const turfOptions = {
    units: lengthUnit === FormattingEnum.Meter ? ("kilometers" as const) : ("miles" as const)
  };
  const distance = turfDistance(positionA, positionB, turfOptions);

  if (lengthUnit === FormattingEnum.Meter) {
    return distance * 1000;
  }

  if (lengthUnit === FormattingEnum.Feet) {
    return distance * 5280;
  }

  return distance;
};

const getMeasurementOrDefault = (modeConfig?: ModeConfigWithMeasurement): Measurement => {
  return modeConfig?.measurement || defaultMeasurementUnit;
};

export const getLengthUnit = (modeConfig?: ModeConfigWithMeasurement): FormattingEnum => {
  const measurement = getMeasurementOrDefault(modeConfig);
  return measurement.lengthUnit;
};

export const getAreaUnit = (modeConfig?: ModeConfigWithMeasurement): FormattingEnum => {
  const measurement = getMeasurementOrDefault(modeConfig);
  return measurement.areaUnit;
};
