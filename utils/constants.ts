import { Measurement } from "types/workspace";

export enum FormattingEnum {
  SquareFeet,
  Percentage,
  Decimal,
  Acres,
  Hectares,
  Feet,
  Meter,
  SquareMeter,
  None
}
export interface MetricsMapping {
  label: string;
  key: string;
  altKey?: string;
  format: FormattingEnum;
  description?: string;
  decimalPlace: number;
}

export const MassingMetricsHeaderMappings = (measurement: Measurement): MetricsMapping[] => {
  return [
    {
      label: "Site Area",
      key: "siteArea",
      format: measurement.areaUnit,
      decimalPlace: 0
    },
    {
      label: "Podium Footprint",
      key: "podiumFootPrint",
      format: measurement.areaUnit,
      decimalPlace: 0
    },
    {
      label: "Tower Footprint",
      key: "towerFootPrint",
      format: measurement.areaUnit,
      decimalPlace: 0
    },
    {
      label: "Building Footprint",
      key: "buildingFootPrint",
      format: measurement.areaUnit,
      decimalPlace: 0
    },
    {
      label: "Site Coverage Ratio",
      key: "siteCoverageRatio",
      format: FormattingEnum.Percentage,
      decimalPlace: 0
    },
    {
      label: "Open Space",
      key: "openSpace",
      format: measurement.largeAreaUnit,
      decimalPlace: 0
    },
    {
      label: "Massing Residential GEA",
      key: "residentialGEA",
      format: measurement.areaUnit,
      decimalPlace: 0
    },
    {
      label: "Podium GEA",
      key: "podiumGEA",
      format: measurement.areaUnit,
      decimalPlace: 0
    },
    {
      label: "Total GEA",
      key: "totalGEA",
      format: measurement.areaUnit,
      decimalPlace: 0
    }
  ];
};

export const FloorplateHeaderMappings = (measurement: Measurement): MetricsMapping[] => {
  return [
    {
      label: "BOMA GEA",
      key: "bomagea",
      format: measurement.areaUnit,
      description: "BOMA Gross Exterior Area",
      decimalPlace: 0
    },
    {
      label: "BOMA A",
      key: "bomaa",
      format: measurement.areaUnit,
      description: "Unit Gross Area",
      decimalPlace: 0
    },
    {
      label: "BOMA B",
      key: "bomab",
      format: measurement.areaUnit,
      description: "Unit Net Area",
      decimalPlace: 0
    },
    {
      label: "Residential GEA",
      key: "residentialGEA",
      format: measurement.areaUnit,
      description:
        "The area required for the Residential Function including Living Unit Areas, Circulation, Common Areas, Amenities, Storage Cages, Service Dock, BOH, MEP&F etc.",
      decimalPlace: 0
    },
    {
      label: "Residential Efficiency BOMA A",
      key: "residentialEfficiencyBOMAA",
      format: FormattingEnum.Percentage,
      description: "BOMA A Area divided by Residential GEA expressed as a %.",
      decimalPlace: 0
    },
    {
      label: "Residential Efficiency BOMA B",
      key: "residentialEfficiencyBOMAB",
      format: FormattingEnum.Percentage,
      description: "BOMA B Area divided by Residential GEA expressed as a %.",
      decimalPlace: 0
    },
    {
      label: "BOMA A/B Efficiency Factor",
      key: "bomaEfficiencyFactor",
      format: FormattingEnum.Decimal,
      description: "BOMA A divided by BOMA B",
      decimalPlace: 2
    },
    {
      label: "BOMA Efficiency Difference",
      key: "bomaEfficiencyDifference",
      format: FormattingEnum.Percentage,
      description:
        "Residential Efficiency BOMA A minus Residential Efficiency BOMA B. This is a Whole of Building Comparison as Efficiency relates to Net over Gross.",
      decimalPlace: 0
    },
    {
      label: "Yield",
      key: "yield",
      format: FormattingEnum.None,
      description: "Number of Units",
      decimalPlace: 0
    }
  ];
};

export const ActualUnitMixHeaderMappings: MetricsMapping[] = [
  {
    label: "Micro Studio",
    key: "G_MicroST",
    altKey: "StMicro",
    format: FormattingEnum.Percentage,
    decimalPlace: 0
  },
  {
    label: "Studio",
    key: "G_ST",
    altKey: "ST",
    format: FormattingEnum.Percentage,
    decimalPlace: 0
  },
  {
    label: "Junior One Bed",
    key: "G_Jr1Br",
    altKey: "B1Jr",
    format: FormattingEnum.Percentage,
    decimalPlace: 0
  },
  {
    label: "One Bed",
    key: "G_1Br",
    altKey: "B1",
    format: FormattingEnum.Percentage,
    decimalPlace: 0
  },
  {
    label: "Two Bed",
    key: "G_2Br",
    altKey: "B2",
    format: FormattingEnum.Percentage,
    decimalPlace: 0
  },
  {
    label: "Three Bed",
    key: "G_3Br",
    altKey: "B3",
    format: FormattingEnum.Percentage,
    decimalPlace: 0
  }
];

export const unitMixTypes: Record<string, string> = {
  STMicro: "Micro Studio",
  ST: "Studio",
  "1BJr": "Junior One Bed",
  "1B": "One Bed",
  "2B": "Two Bed",
  "3B": "Three Bed"
};

export const areaMultiplier = 27.5; //Supplied by solver team to calc the area

export const defaultMeasurementUnit: Measurement = {
  lengthUnit: FormattingEnum.Feet,
  areaUnit: FormattingEnum.SquareFeet,
  largeAreaUnit: FormattingEnum.Acres
};
