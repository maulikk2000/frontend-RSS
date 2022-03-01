import { Vector3 } from "three";
import { areaMultiplier } from "utils/constants";
import { isVectorsClockwise } from "../components/utils";
import { SiteConfiguration, Tower, UnitMix } from "../data/v2/types";
import { createDefaultPlot, createDefaultTower } from "../utilities/configurationUtils";
import { initialState, BuildingServiceStoreApi } from "./buildingServiceStoreV2";
import { updateEnvelopeScoresFromSpineLength, updateSpineFromBuildingTypology } from "./storeUtils";

export type UnitTypeArea = {
  unitMixType: string;
  minArea: number;
  maxArea: number;
};

// Extend store actions with the following message store actions.
export const buildingServiceConfigurationActions = {
  clearBuildingServiceStore: () => ({ setState, getState }) => {
    setState({
      ...initialState
    });
  },

  setPodiumBoundary: (boundary: Vector3[]) => ({ setState, getState }) => {
    const configuration: SiteConfiguration = { ...getState().configuration };

    if (!boundary[0].equals(boundary[boundary.length - 1])) {
      boundary.push(boundary[0]);
    }

    configuration.plots[getState().selectedPlotIndex].podium.boundary = boundary;

    setState({
      configuration
    });
  },

  setStandardFloorCount: (floorCount) => ({ setState, getState, dispatch }) => {
    floorCount = floorCount < 1 ? 1 : floorCount;
    floorCount = floorCount > 100 ? 100 : floorCount;

    const configuration: SiteConfiguration = { ...getState().configuration };
    configuration.plots[getState().selectedPlotIndex].towers[getState().selectedObjectIndex].floorCount = floorCount;

    setState({
      configuration
    });
  },

  setBuildingTypology: (buildingTypology) => ({ setState, getState }) => {
    const configuration: SiteConfiguration = { ...getState().configuration };
    const tower = configuration.plots[getState().selectedPlotIndex].towers[getState().selectedObjectIndex];

    if (buildingTypology === tower.buildingTypology) {
      return;
    }

    tower.buildingTypology = buildingTypology;

    const spine = updateSpineFromBuildingTypology(buildingTypology, tower);
    tower.spine = spine;

    const envelopeScores = updateEnvelopeScoresFromSpineLength(tower);
    tower.envelopeScores = envelopeScores;

    setState({
      configuration
    });
  },

  setPodiumFloorCount: (floorCount) => ({ setState, getState }) => {
    const configuration: SiteConfiguration = { ...getState().configuration };
    configuration.plots[getState().selectedPlotIndex].podium.floorCount = floorCount;
    configuration.plots[getState().selectedPlotIndex].parking.floorCount = floorCount;

    configuration.plots[getState().selectedPlotIndex].towers.map((tower) => {
      return (tower.zOffset = floorCount * configuration.plots[getState().selectedPlotIndex].podium.floorToFloorHeight);
    });

    setState({
      configuration
    });
  },

  setMinMaxAreaForPlotId: (plotId: string, minMaxArea: UnitTypeArea) => ({ getState, setState }) => {
    const configuration: SiteConfiguration = { ...getState().configuration };
    const plots = [...configuration.plots];

    const plot = configuration.plots.find((p) => p.id === plotId);
    if (plot) {
      // For now, we use the plot areas for each tower within that plot
      const updatedTowers: Tower[] = plot.towers.map((tower) => ({
        ...tower,
        apartmentCatalog: tower.apartmentCatalog?.map((apartmentCatalogItem) => {
          const isMinMaxForUnitType = minMaxArea.unitMixType === apartmentCatalogItem.unitMixType;
          return {
            ...apartmentCatalogItem,
            minFrontage: isMinMaxForUnitType ? minMaxArea?.minArea / areaMultiplier : apartmentCatalogItem.minFrontage,
            maxFrontage: isMinMaxForUnitType ? minMaxArea?.maxArea / areaMultiplier : apartmentCatalogItem.maxFrontage
          };
        })
      }));

      const plotIndex = plots.indexOf(plot);
      plots.splice(plotIndex, 1, { ...plot, towers: updatedTowers });
    }

    configuration.plots = plots;

    setState({
      configuration
    });
  },

  setUnitMixForPlotId: (plotId: string, unitMix: UnitMix[]) => async ({ getState, setState }) => {
    const configuration: SiteConfiguration = { ...getState().configuration };
    const plots = [...configuration.plots];

    const plot = configuration.plots.find((p) => p.id === plotId);
    if (plot) {
      // For now, we use the plot unit mix for each tower within that plot
      const updatedTowers: Tower[] = plot.towers.map((tower) => ({
        ...tower,
        unitMix
      }));

      const plotIndex = plots.indexOf(plot);
      plots.splice(plotIndex, 1, { ...plot, towers: updatedTowers });
    }

    configuration.plots = plots;

    setState({
      configuration
    });
  },

  setSpine: (spine: Vector3[]) => ({ setState, getState, dispatch }) => {
    const configuration: SiteConfiguration = { ...getState().configuration };

    const clockwiseSpine = isVectorsClockwise(spine);
    if (clockwiseSpine) {
      spine.reverse();
    }

    configuration.plots[getState().selectedPlotIndex].towers[getState().selectedObjectIndex].spine = [...spine];

    if (spine.length === 2) {
      configuration.plots[getState().selectedPlotIndex].towers[getState().selectedObjectIndex].buildingTypology = "Bar";
    } else if (spine.length === 3) {
      configuration.plots[getState().selectedPlotIndex].towers[getState().selectedObjectIndex].buildingTypology =
        "LShape";
    } else if (spine.length === 4) {
      configuration.plots[getState().selectedPlotIndex].towers[getState().selectedObjectIndex].buildingTypology =
        "CShape";
    }

    setState({
      configuration
    });
  },

  addPlot: (boundary: Vector3[]) => ({ setState, getState }: BuildingServiceStoreApi) => {
    const configuration = getState().configuration!;
    const plot = createDefaultPlot(boundary);
    configuration.plots.push(plot);

    setState({
      configuration,
      selectedPlotIndex: configuration.plots.length - 1,
      selectedObjectIndex: configuration.plots.length - 1
    });
  },

  addTower: (spine: Vector3[]) => ({ setState, getState }: BuildingServiceStoreApi) => {
    if (spine.length === 0) {
      return;
    }
    const configuration = getState().configuration!;
    const tower = createDefaultTower(spine);
    configuration.plots[getState().selectedPlotIndex].towers.push(tower);

    setState({
      configuration,
      selectedObjectIndex: configuration.plots[getState().selectedPlotIndex].towers.length - 1
    });
  }
};
