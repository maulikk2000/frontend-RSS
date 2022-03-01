import { ActualUnitMixHeaderMappings, FormattingEnum, MetricsMapping } from "utils/constants";
import { appendUnitFormat, formatDataForDisplay } from "utils/units";
import {
  FloorMetric,
  PlotMetrics,
  SiteMetrics,
  TowerMetricItems,
  UnitMetric
} from "pages/configurator/data/v2/buildingDatav2";

export const getMetricRows = (
  mappings: MetricsMapping[],
  metricsPropertyName: string,
  data: TowerMetricItems | SiteMetrics | PlotMetrics
): string[][] => {
  return mappings.map((mapping) => {
    return [
      mapping.label,
      formatDataForDisplay(mapping.format, data[metricsPropertyName][mapping.key], mapping.decimalPlace)
    ];
  });
};

export const getUnitMetricRows = (data: UnitMetric[]): string[][] => {
  return ActualUnitMixHeaderMappings.map((mapping) => [
    mapping.label,
    formatDataForDisplay(
      mapping.format,
      data.find((um) => um.unitType === mapping.key || um.unitType === mapping.altKey)?.yieldMixActual,
      mapping.decimalPlace
    )
  ]);
};

export const getFloorMetrics = (
  data: FloorMetric[],
  measurementUnit: FormattingEnum,
  decimalPlace: number = 0
): string[][] => {
  const floorData = data.map((floor, i) => {
    return [
      `Level ${i + 1} ${appendUnitFormat(measurementUnit)}`,
      formatDataForDisplay(measurementUnit, floor.bomaansa, decimalPlace),
      formatDataForDisplay(measurementUnit, floor.bomabnsa, decimalPlace)
    ];
  });
  return [["Level", "BOMA A NSA", "BOMA B NSA"], ...floorData];
};
