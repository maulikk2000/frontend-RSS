import { Vector3 } from "three";
import { Project } from "types/project";
import { pointToVector3, vector3ToPoint, coordinateToCartesian, coordinateToVector3 } from "../components/utils";
import { EW_844_Configuration, EW_913_Configuration } from "../data/plans";
import { BuildingConfigurationLocation, CubsPoint } from "../data/types";
import { Parking, Podium, Tower, SiteConfiguration, BuildingServiceState, Plot } from "../data/v2/types";
import {
  getDefaultBuildingTypology,
  getDefaultActivityMix,
  getDefaultDevelopmentProductTypology,
  getDefaultEnvelopeScores,
  getDefaultFloorHeight,
  getDefaultLocation,
  getDefaultMarketTypology,
  getDefaultPodiumBoundary,
  getDefaultTowerSpine,
  getDefaultVerticalTransportStrategy,
  getDefaultWidth,
  getDefaultPodiumFloorHeight,
  getDefaultPodiumFloorCount,
  getDefaultSleeveDepths,
  getDefaultFacade,
  getDefaultApartmentCatalog,
  getDefaultCorridorWidth,
  getDefaultDeadEndUnits,
  getDefaultCoreWidth,
  getDefaultFloorCount,
  getDefaultUnitMix,
  getDefaultSiteBoundary
} from "./configurationDefaults";

export const createDefaultTower = (towerSpine?: Vector3[]): Tower => {
  let spine: Vector3[] | undefined = towerSpine;

  if (!spine) {
    spine = getDefaultTowerSpine();
  }

  const location = getDefaultLocation();
  const floorCount = getDefaultFloorCount();
  const floorToFloorHeight = getDefaultFloorHeight();
  const envelopeScores = getDefaultEnvelopeScores(spine);
  const unitMix = getDefaultUnitMix();
  const marketTypology = getDefaultMarketTypology();
  const developmentProductTypology = getDefaultDevelopmentProductTypology();
  const verticalTransportStrategy = getDefaultVerticalTransportStrategy();
  const buildingTypology = getDefaultBuildingTypology(spine);
  const width = getDefaultWidth();
  const zOffset = getDefaultPodiumFloorCount() * getDefaultPodiumFloorHeight();
  const facade = getDefaultFacade();
  const apartmentCatalog = getDefaultApartmentCatalog();
  const deadEndUnits = getDefaultDeadEndUnits();
  const corridorWidth = getDefaultCorridorWidth();
  const coreWidth = getDefaultCoreWidth();

  const tower: Tower = {
    location,
    spine,
    width,
    floorCount,
    floorToFloorHeight,
    facade,
    envelopeScores,
    unitMix,
    zOffset,
    marketTypology,
    developmentProductTypology,
    verticalTransportStrategy,
    buildingTypology,
    apartmentCatalog,
    deadEndUnits,
    corridorWidth,
    coreWidth
  };

  return tower;
};

export const createDefaultPodium = (podiumBoundary?: Vector3[]) => {
  let boundary: Vector3[] | undefined = podiumBoundary;

  if (!boundary) {
    boundary = getDefaultPodiumBoundary();
  } else {
    if (!boundary[0].equals(boundary[boundary.length - 1])) {
      boundary.push(boundary[0]);
    }
  }
  const floorToFloorHeight = getDefaultPodiumFloorHeight();
  const floorCount = getDefaultPodiumFloorCount();
  const envelopeScores = getDefaultEnvelopeScores(boundary);
  const activityMix = getDefaultActivityMix();
  const sleeveDepths = getDefaultSleeveDepths();
  const isPodiumFlush = false;

  const podium: Podium = {
    floorToFloorHeight,
    floorCount,
    envelopeScores,
    activityMix,
    boundary,
    sleeveDepths,
    isPodiumFlush
  };

  return podium;
};

export const createDefaultPlot = (podiumBoundary?: Vector3[]) => {
  const podium = createDefaultPodium(podiumBoundary);
  const randomId = Math.floor(Math.random() * 1000);
  const plot: Plot = {
    id: "plot" + randomId,
    label: "R" + randomId,
    parking: createDefaultParking(podium.boundary),
    podium: podium,
    towers: []
  };

  return plot;
};

export const createDefaultParking = (boundary: Vector3[]) => {
  const stallWidth = 10;
  const stallDepth = 18;
  const aisleWidth = 20;
  const floorCount = 2;
  const floorToFloorHeight = 10;

  const parking: Parking = {
    stallWidth,
    stallDepth,
    aisleWidth,
    boundary,
    floorCount,
    floorToFloorHeight
  };

  return parking;
};

export const createDefaultTowers = (numberOfTowers: number) => {
  const towers: Tower[] = [];

  if (numberOfTowers === 1) {
    let tower1Spine: Vector3[] = [new Vector3(0, 150, 0), new Vector3(0, -50, 0)];
    let tower1: Tower = createDefaultTower(tower1Spine);
    towers.push(tower1);
  } else if (numberOfTowers === 2) {
    let tower1Spine: Vector3[] = [new Vector3(-104, 150, 0), new Vector3(-104, -50, 0)];
    let tower1: Tower = createDefaultTower(tower1Spine);
    towers.push(tower1);

    let tower2Spine: Vector3[] = [new Vector3(104, -61.667, 0), new Vector3(104, 120, 0), new Vector3(-30, 120, 0)];
    let tower2: Tower = createDefaultTower(tower2Spine);
    towers.push(tower2);
  } else {
    let tower1Spine: Vector3[] = [new Vector3(-104, 150, 0), new Vector3(-104, -50, 0)];
    let tower1: Tower = createDefaultTower(tower1Spine);
    towers.push(tower1);

    let tower2Spine: Vector3[] = [new Vector3(104, -150, 0), new Vector3(104, 120, 0), new Vector3(-41, 120, 0)];
    let tower2: Tower = createDefaultTower(tower2Spine);
    towers.push(tower2);

    let tower3Spine: Vector3[] = [new Vector3(40, -120, 0), new Vector3(-134, -120, 0)];
    let tower3: Tower = createDefaultTower(tower3Spine);
    towers.push(tower3);
  }

  return towers;
};

export const createEastWhismanTowers1 = () => {
  const towers: Tower[] = [];

  let tower1Spine: Vector3[] = [new Vector3(-104, 150, 0), new Vector3(-104, -50, 0)];
  let tower1: Tower = createDefaultTower(tower1Spine);
  towers.push(tower1);

  let tower2Spine: Vector3[] = [new Vector3(104, -150, 0), new Vector3(104, 120, 0), new Vector3(-41, 120, 0)];
  let tower2: Tower = createDefaultTower(tower2Spine);
  towers.push(tower2);

  let tower3Spine: Vector3[] = [new Vector3(40, -120, 0), new Vector3(-134, -120, 0)];
  let tower3: Tower = createDefaultTower(tower3Spine);
  towers.push(tower3);

  return towers;
};

export const createEastWhismanTowers2 = () => {
  const towers: Tower[] = [];

  let tower2Spine: Vector3[] = [new Vector3(104, -61.667, 0), new Vector3(104, 150, 0)];
  let tower2: Tower = createDefaultTower(tower2Spine);
  towers.push(tower2);

  let tower3Spine: Vector3[] = [new Vector3(134, -120, 0), new Vector3(-85, -120, 0)];
  let tower3: Tower = createDefaultTower(tower3Spine);
  towers.push(tower3);

  return towers;
};

export const createCustomSiteConfiguration = (scenarioId: string, project: Project) => {
  let longitude: number = project.siteWorldCoordinates[0];
  let latitude: number = project.siteWorldCoordinates[1];

  const location: BuildingConfigurationLocation = getDefaultLocation();

  const configuration: SiteConfiguration = {
    scenarioId,
    bearing: 0,
    plots: [],
    boundary: createSiteBoundaryFromProject(project),
    location,
    longitude,
    latitude
  };

  return configuration;
};

export const createEastWhismanSiteConfiguration = (study: "844" | "913", scenarioId: string, project: Project) => {
  let siteScenario = EW_844_Configuration;

  if (study === "913") {
    siteScenario = EW_913_Configuration;
  }

  let longitude: number = project.siteWorldCoordinates[0];
  let latitude: number = project.siteWorldCoordinates[1];

  const plots: Plot[] = [];

  siteScenario.plots.map((plot, index) => {
    const podium = createDefaultPodium(plot.podium.boundary);
    const parking = createDefaultParking(podium.boundary);
    let plot0Towers: Tower[] = [];

    for (const tower of plot.towers) {
      const createdTower = createDefaultTower(tower.spine);
      createdTower.floorCount = tower.floorCount;
      plot0Towers.push(createdTower);
    }

    const plot1: Plot = {
      id: "plot" + (index + 1),
      label: "R" + (index + 1),
      parking: parking,
      podium: podium,
      towers: plot0Towers
    };
    plots.push(plot1);

    return plot;
  });
  const location: BuildingConfigurationLocation = getDefaultLocation();

  const configuration: SiteConfiguration = {
    scenarioId,
    bearing: 0,
    plots: plots,
    boundary: createSiteBoundaryFromProject(project),
    location,
    longitude,
    latitude
  };

  return configuration;
};

export const createSiteBoundaryFromProject = (project: Project): CubsPoint[] => {
  let vectors: Vector3[] = getDefaultSiteBoundary().map(pointToVector3);
  if (!project.coordinates) {
    return vectors.map(vector3ToPoint);
  }
  const cartesians = project.coordinates.map((coordinate) => {
    return coordinateToCartesian(coordinate, project.siteWorldCoordinates, "ft");
  });

  vectors = cartesians.map(coordinateToVector3);
  if (vectors[0].equals(vectors[vectors.length - 1])) {
    vectors.pop();
  }

  return vectors.map(vector3ToPoint);
};

export type ConfiguratorObjects = "podium" | "parking" | "tower" | "plot" | null;
export type SelectedObject = {
  object: ConfiguratorObjects;
  index: number | null;
  plotIndex: number | null;
};

export const getSelectedObject = (buildingService: BuildingServiceState): SelectedObject => {
  if (!buildingService.configuration || buildingService.configuration.plots.length === 0) {
    return { object: null, index: null, plotIndex: null };
  }

  const plotIndex = buildingService.selectedPlotIndex;
  const towerIndex = buildingService.selectedObjectIndex;
  const objectIndex = buildingService.selectedObjectIndex;
  const plot = buildingService.configuration.plots[plotIndex];

  const towersLength = plot.towers.length;

  if (objectIndex === null) {
    return { object: null, index: null, plotIndex: null };
  }

  if (towersLength === objectIndex) {
    return { object: "podium", index: plotIndex, plotIndex: plotIndex };
  }

  if (towersLength + 1 === objectIndex) {
    return { object: "parking", index: plotIndex, plotIndex: plotIndex };
  }

  if (towersLength + 2 === objectIndex) {
    return { object: "plot", index: plotIndex, plotIndex: plotIndex };
  }

  if (objectIndex < towersLength) {
    return { object: "tower", index: towerIndex, plotIndex: plotIndex };
  }

  return { object: null, index: null, plotIndex: null };
};

export const isObjectSelected = (buildingService: BuildingServiceState, object: ConfiguratorObjects) => {
  const selectedObject = getSelectedObject(buildingService);

  switch (object) {
    case "podium":
      if (selectedObject.object === "podium" && selectedObject.index !== null && selectedObject.plotIndex !== null) {
        return true;
      }
      break;
    case "tower":
      if (selectedObject.object === "tower" && selectedObject.index !== null && selectedObject.plotIndex !== null) {
        return true;
      }
      break;
    case "plot":
      if (selectedObject.object === "plot" && selectedObject.index !== null && selectedObject.plotIndex !== null) {
        return true;
      }
      break;
    case "parking":
      if (selectedObject.object === "parking" && selectedObject.index !== null && selectedObject.plotIndex !== null) {
        return true;
      }
      break;
    default:
      return false;
  }
};
