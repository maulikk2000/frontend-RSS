import { MessageStoreState } from "types/extensions/messageExtension";
import { Object3D, Vector3 } from "three";
import { CONFIGURATOR_STATE } from "../enums";
import { CubsPoint } from "../types";
import { BuildingV2 } from "./buildingDatav2";
import { ApiCallState, ApiCallStateWithCleared } from "types/common";

export type BuildingServiceState = MessageStoreState & {
  selectedPlotIndex: number;
  selectedObjectIndex: number | null;
  configuration: SiteConfiguration | null | undefined;
  siteConfigurationState: ApiCallStateWithCleared;
  geometries: BuildingGeometries | null;
  objects: Array<Object3D> | null;
  trace: string | null;
  cancelSource: any;
  status: CONFIGURATOR_STATE | null;
  errors: BuildingServiceError | null;
  building: BuildingV2 | null;
  buildingState: ApiCallState;
};

export type BuildingGeometries = {
  buildingId: string;
  data: SolverGeometry[];
};

export type SolverGeometry = {
  geometry: GeometryData;
  solverName: string;
};

export type GeometryData = {
  expiry: string;
  url: string;
};

export type SiteConfiguration = {
  id?: string;
  scenarioId: string;
  plots: Plot[];
  boundary: CubsPoint[];
  location: Location;
  longitude: number;
  latitude: number;
  bearing: number;
  created?: Date;
  updated?: Date;
};

export type Plot = {
  id: string;
  label: string;
  podium: Podium;
  parking: Parking;
  towers: Tower[];
};

export type Parking = {
  stallWidth: number;
  stallDepth: number;
  aisleWidth: number;
  rampGrade?: number | null;
  carparkingEntryWidth?: number | null;
  turningRadius?: number | null;

  boundary: Vector3[];
  floorToFloorHeight: number;
  floorCount: number;
};

export type Podium = {
  floorToFloorHeight: number;
  floorCount: number;
  boundary: Vector3[];

  envelopeScores: number[];
  activityMix: ActivityMix[];
  sleeveDepths: number[];
  isPodiumFlush: boolean;
};

export type Tower = {
  location: Location;

  spine: Vector3[];
  floorCount: number;
  floorToFloorHeight: number;
  width: number;

  envelopeScores: number[];
  unitMix: UnitMix[];
  facade: Facade;
  marketTypology: string;
  developmentProductTypology: string;
  verticalTransportStrategy: string;
  buildingTypology: "Bar" | "LShape" | "CShape" | undefined;
  zOffset: number;
  apartmentCatalog?: ApartmentCatalog[];
  deadEndUnits?: string;
  corridorWidth?: number;
  coreWidth?: number;
};

export type ApartmentCatalog = {
  minFrontage: number;
  maxFrontage: number;
  unitMixType: string;
  apartmentType: string;
  floorPlateLocationPriorities: FloorPlateLocationPriorities[];
};

export type FloorPlateLocationPriorities =
  | "PrimaryFrontage"
  | "SecondaryFrontage"
  | "Corner"
  | "ExternalCorner"
  | "ExternalCornerVariableAngle";

export type Facade = {
  designPreset: string;
};

export type Location = {
  o: { [key: string]: number };
  i: { [key: string]: number };
  j: { [key: string]: number };
  k: { [key: string]: number };
};

export type ActivityMix = {
  type: string;
  percentage: number;
};

export type UnitMix = {
  type: string;
  percentage: number;
};

export type V2CreateFlow = {
  configurationId: string;
  scenarioId: string;
  userId?: string;
  buildingId?: string;
  solvers: V2Solver[];
};

export type V2Flow = {
  id: string;
  buildingId: string;
  siteId?: string;
  created: string;
  scenarioId: string;
  siteConfigurationId: string;
  steps: V2Step[];
};

export type V2Step = {
  solver: V2Solver;
  isSuccess: boolean;
};

export type V2Solver = {
  ghxPointer?: string;
  version?: string;
  platform?: string;
  name: string;
  environment?: "Docker" | "DockerTest";
  isEnabled?: boolean;
};

export type ConfigurationSelectedItems = {
  podium: boolean;
  towerIndex: number[] | null;
};

export type BuildingServiceError = {
  title: string;
  errors?: Object;
  traceId?: string | null;
};

export type SiteConfigurationContract = {
  id?: string;
  scenarioId: string;
  podium: PodiumContract;
  parking: ParkingContract;
  towers: TowerContract[];
  boundary?: CubsPoint[];
  location: Location;
  bearing: number;
  longitude: number;
  latitude: number;
  created?: Date;
  updated?: Date;
};

export type ParkingContract = {
  stallWidth: number;
  stallDepth: number;
  aisleWidth: number;
  rampGrade?: number | null;
  carparkingEntryWidth?: number | null;
  turningRadius?: number | null;
  boundary: CubsPoint[];
  floorToFloorHeight: number;
  floorCount: number;
};

export type PodiumContract = {
  floorToFloorHeight: number;
  floorCount: number;
  envelopeScores: number[];
  activityMix: ActivityMix[];
  boundary: CubsPoint[];
  sleeveDepths: number[];
  isPodiumFlush: boolean;
};

export type TowerContract = {
  location: Location;
  spine: CubsPoint[];
  floorCount: number;
  floorToFloorHeight: number;
  envelopeScores: number[];
  unitMix: UnitMix[];
  facade: Facade;
  marketTypology: string;
  developmentProductTypology: string;
  verticalTransportStrategy: string;
  buildingTypology: "Bar" | "LShape" | "CShape" | undefined;
  zOffset: number;
  width: number;
  apartmentCatalog?: ApartmentCatalog[];
  deadEndUnits?: string;
  corridorWidth?: number;
  coreWidth?: number;
};
