import { BuildingConfigurationLocation, CubsPoint, FacadeFrontage, Room } from "../types";

export type Space = {
  id: string;
  boundary: CubsPoint[];
  height: number;
  location: BuildingConfigurationLocation;
  spaceType: string;
  spaceArea: number;
};

export type BoundingSpace = {
  id: string;
  boundary: CubsPoint[];
  height: number;
  location: BuildingConfigurationLocation;
  spaceType: string;
  spaceArea: number;
};

export type Apartment = {
  id: string;
  apartmentType: string;
  unitMixType: string;
  frontage: number;
  depth: number;
  height: number;
  location: BuildingConfigurationLocation;
  rooms: Room;
  bedroomCount: number;
  bathroomCount: number;
  facadeFrontages: FacadeFrontage[];
  boundingSpace: BoundingSpace;
  storey: string;
  corridorPointIndices: number[];
  netSellableArea: number;
  cubsResource: string;
};

export type VerticalTransport = {
  id: string;
  depth: number;
  width: number;
  height: number;
  cubsResource: string;
  area: number;
  type: string;
  storey: string;
  location: BuildingConfigurationLocation;
  boundingSpace: BoundingSpace;
  facadeFrontages: FacadeFrontage[];
};

export type UnitMetric = {
  unitType: string;
  areaTarget: number;
  areaActual: number;
  areaVariance: number;
  yield: number;
  yieldMixActual: number;
  yieldMixTarget: number;
};

export type FloorMetric = {
  level: string;
  value: string;
  bomaansa: number;
  bomabnsa: number;
  area: number;
};

export type TowerMetricItems = {
  towerMetrics: FloorPlateMetrics;
  unitMetrics: UnitMetric[];
  floorMetrics: FloorMetric[];
};

export type SolvedTower = {
  floorCount: number;
  floorToFloorHeight: number;
  height: number;
  spine: CubsPoint[];
  spaces: Space[];
  apartments: Apartment[];
  verticalTransport: VerticalTransport[];
  towerMetrics: TowerMetricItems;
};

export type Massing = {
  id: string;
  boundary: CubsPoint[];
  height: number;
  location: BuildingConfigurationLocation;
  spaceType: string;
  spaceArea: number;
};

export type Activity = {
  type: string;
  percentage: number;
};

export type Podium = {
  floorCount: number;
  floorToFloorHeight: number;
  massing: Massing;
  spaces: Space[];
  activities: Activity[];
};

export type Building = {
  towers: SolvedTower[];
  podium: Podium;
  location: BuildingConfigurationLocation;
  latitude: number;
  longitude: number;
  altitude: number;
  length: number;
  width: number;
};

export type MassingMetrics = {
  siteArea: number;
  buildingFootPrint: number;
  podiumFootPrint: number;
  towerFootPrint: number;
  siteCoverageRatio: number;
  openSpace: number;
  residentialGEA: number;
  podiumGEA: number;
  totalGEA: number;
};

export type FloorPlateMetrics = {
  height: number;
  bomaa: number;
  bomagea: number;
  netSalesAreaBomaA: number;
  netSalesAreaBomaB: number;
  bomab: number;
  bomaAFactor: number;
  bomaADifference: number;
  gsf: number;
  residentialGSF: number;
  residentialGEA: number;
  gea: number;
  residentialEfficiency: number;
  residentialEfficiencyBOMAA: number;
  residentialEfficiencyBOMAB: number;
  bomaEfficiencyFactor: number;
  bomaEfficiencyDifference: number;
  apartmentEfficiency: number;
  nsf: number;
  yield: number;
};

export type PlotMetrics = {
  massingMetrics: MassingMetrics;
  floorPlateMetrics: FloorPlateMetrics;
  unitMetrics: UnitMetric[];
};

export type SolvedPlot = {
  id: string;
  scenarioId: string;
  label: string;
  building: Building;
  plotMetrics: PlotMetrics;
};

export type SiteMetrics = {
  massingMetrics: MassingMetrics;
  floorPlateMetrics: FloorPlateMetrics;
  unitMetrics: UnitMetric[];
};

export type BuildingV2 = {
  id?: string;
  boundary: BoundingSpace;
  scenarioId: string;
  plots: SolvedPlot[];
  siteMetrics: SiteMetrics;
};
