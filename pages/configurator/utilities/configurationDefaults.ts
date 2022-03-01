import { Vector3 } from "three";
import { vector3ToPoint } from "../components/utils";
import { BUILDING_MAXWIDTH } from "../data/constants";
import { BuildingConfigurationLocation } from "../data/types";
import { ApartmentCatalog, Facade, UnitMix } from "../data/v2/types";

export const getDefaultBearing = () => {
  const bearing = 0;
  return bearing;
};

export const getDefaultLocation = () => {
  const location: BuildingConfigurationLocation = {
    o: {
      ptX: 0,
      ptY: 0,
      ptZ: 0,
      pointLabel: 0
    },
    i: {
      ptX: 1,
      ptY: 0,
      ptZ: 0,
      pointLabel: 0
    },
    j: {
      ptX: 0,
      ptY: 1,
      ptZ: 0,
      pointLabel: 0
    },
    k: {
      ptX: 0,
      ptY: 0,
      ptZ: 1,
      pointLabel: 0
    }
  };

  return location;
};

export const getDefaultWidth = () => {
  const width = BUILDING_MAXWIDTH;

  return width;
};

export const getDefaultFacadeDesignPreset = () => {
  const designPreset = "preset_1";
  return designPreset;
};

export const getDefaultFacade = () => {
  const facade: Facade = {
    designPreset: getDefaultFacadeDesignPreset()
  };

  return facade;
};

export const getDefaultApartmentCatalog = () => {
  const apartmentCatalog: ApartmentCatalog[] = [
    {
      minFrontage: 12,
      maxFrontage: 14,
      unitMixType: "StMicro",
      apartmentType: "STSSSA",
      floorPlateLocationPriorities: ["PrimaryFrontage", "SecondaryFrontage"]
    },
    {
      minFrontage: 14,
      maxFrontage: 16,
      unitMixType: "ST",
      apartmentType: "STSSSB",
      floorPlateLocationPriorities: ["PrimaryFrontage", "SecondaryFrontage"]
    },
    {
      minFrontage: 18,
      maxFrontage: 20,
      unitMixType: "B1Jr",
      apartmentType: "B1SSSA",
      floorPlateLocationPriorities: ["PrimaryFrontage", "SecondaryFrontage"]
    },
    {
      minFrontage: 24,
      maxFrontage: 26,
      unitMixType: "B1",
      apartmentType: "B1SSSB",
      floorPlateLocationPriorities: ["PrimaryFrontage", "SecondaryFrontage"]
    },
    {
      minFrontage: 36,
      maxFrontage: 38,
      unitMixType: "B2",
      apartmentType: "B2SSSA",
      floorPlateLocationPriorities: ["PrimaryFrontage", "SecondaryFrontage"]
    },
    {
      minFrontage: 48,
      maxFrontage: 50,
      unitMixType: "B3",
      apartmentType: "B3SSSA",
      floorPlateLocationPriorities: ["PrimaryFrontage", "SecondaryFrontage"]
    },
    {
      minFrontage: 36,
      maxFrontage: 36,
      unitMixType: "B2",
      apartmentType: "B2CLSA",
      floorPlateLocationPriorities: ["Corner"]
    },
    {
      minFrontage: 48,
      maxFrontage: 48,
      unitMixType: "B3",
      apartmentType: "B3CLSA",
      floorPlateLocationPriorities: ["Corner"]
    },
    {
      minFrontage: 48,
      maxFrontage: 48,
      unitMixType: "B3",
      apartmentType: "B3CRSG",
      floorPlateLocationPriorities: ["ExternalCorner"]
    },
    {
      minFrontage: 48,
      maxFrontage: 48,
      unitMixType: "B3",
      apartmentType: "B3CRSH",
      floorPlateLocationPriorities: ["ExternalCornerVariableAngle"]
    }
  ];

  return apartmentCatalog;
};

export const getDefaultDeadEndUnits = () => {
  const deadEndUnits = "TwoBedroomUnits";

  return deadEndUnits;
};

export const getDefaultCorridorWidth = () => {
  const corridorWidth = 10;

  return corridorWidth;
};

export const getDefaultCoreWidth = () => {
  const coreWidth = 10;

  return coreWidth;
};

export const getDefaultFloorCount = () => {
  const floorCount = 7;

  return floorCount;
};

export const getDefaultFloorHeight = () => {
  const floorHeight = 10;

  return floorHeight;
};

export const getDefaultPodiumFloorCount = () => {
  const floorCount = 2;

  return floorCount;
};

export const getDefaultPodiumFloorHeight = () => {
  const floorHeight = 10;

  return floorHeight;
};

export const getDefaultEnvelopeScores = (spine: Vector3[]) => {
  const envelopeScores = spine.length > 2 ? [1, 0, 0, 0, 0, 0] : [1, 0, 0, 0];

  return envelopeScores;
};

export const getDefaultUnitMix = (): UnitMix[] => {
  const unitMix = [
    {
      type: "1B",
      percentage: 40
    },
    {
      type: "2B",
      percentage: 10
    },
    {
      type: "3B",
      percentage: 5
    },
    {
      type: "ST",
      percentage: 20
    },
    {
      type: "STMicro",
      percentage: 5
    },
    {
      type: "1BJr",
      percentage: 20
    }
  ];

  return unitMix;
};

export const getDefaultMarketTypology = () => {
  const marketTypology = "Market";

  return marketTypology;
};

export const getDefaultDevelopmentProductTypology = () => {
  const developmentProductTypology = "Residential";

  return developmentProductTypology;
};

export const getDefaultVerticalTransportStrategy = () => {
  const verticalTransportStrategy = "SideCore";

  return verticalTransportStrategy;
};

export const getDefaultBuildingTypology = (spine: Vector3[]) => {
  let buildingTypology: "Bar" | "LShape" | "CShape" | undefined = "Bar";

  if (spine.length === 3) {
    buildingTypology = "LShape";
  }

  return buildingTypology;
};

export const getDefaultActivityMix = () => {
  const activityMix = [
    {
      type: "Commercial",
      percentage: 10
    },
    {
      type: "Spa",
      percentage: 90
    }
  ];

  return activityMix;
};

export const getDefaultSleeveDepths = () => {
  const sleeveDepths = [2, 2, 2, 2];
  return sleeveDepths;
};

export const getDefaultPodiumBoundary = () => {
  const boundary: Vector3[] = [
    new Vector3(-134, -150, 0),
    new Vector3(134, -150, 0),
    new Vector3(134, 150, 0),
    new Vector3(-134, 150, 0),
    new Vector3(-134, -150, 0)
  ];

  return boundary;
};

export const getDefaultTowerSpine = () => {
  const spine: Vector3[] = [new Vector3(-134, 0, 0), new Vector3(134, 0, 0)];

  return spine;
};

export const getDefaultSiteBoundary = () => {
  const boundary: Vector3[] = [
    new Vector3(-200, -200, 0),
    new Vector3(200, -200, 0),
    new Vector3(200, 200, 0),
    new Vector3(-200, 200, 0),
    new Vector3(-200, -200, 0)
  ];

  return boundary.map(vector3ToPoint);
};
