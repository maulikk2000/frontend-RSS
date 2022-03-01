import { createHook } from "react-sweet-state";
import { BuildingServiceState } from "../data/v2/types";
import { v2BuildingServiceStore } from "./buildingServiceStoreV2";

export const getSelectedPlot = (state: BuildingServiceState) => state.configuration?.plots[state.selectedPlotIndex];

export const useSelectedPlot = createHook(v2BuildingServiceStore, {
  selector: getSelectedPlot
});

export const getSelectedTower = (state: BuildingServiceState) => {
  if (!state.configuration) {
    return null;
  }

  const plots = state.configuration.plots;

  if (plots.length === 0) {
    return null;
  }

  const selectedPlot = plots[state.selectedPlotIndex];
  const towers = selectedPlot.towers;
  if (state.selectedObjectIndex !== null && state.selectedObjectIndex < towers.length) {
    return towers[state.selectedObjectIndex];
  } else {
    return null;
  }
};

export const useSelectedTower = createHook(v2BuildingServiceStore, {
  selector: getSelectedTower
});

export const getSelectedPodium = (state: BuildingServiceState) => {
  if (!state.configuration) {
    return null;
  }

  const plots = state.configuration.plots;

  if (plots.length === 0) {
    return null;
  }

  const selectedPlot = plots[state.selectedPlotIndex];
  const towers = selectedPlot.towers;

  if (state.selectedObjectIndex !== null && state.selectedObjectIndex === towers.length) {
    return selectedPlot.podium;
  } else {
    return null;
  }
};

export const useSelectedPodium = createHook(v2BuildingServiceStore, {
  selector: getSelectedPodium
});

const isManualEastwhismanData = (state: BuildingServiceState) => state.building?.plots[0].building.podium;

export const useIsManualEastWhismanData = createHook(v2BuildingServiceStore, {
  selector: isManualEastwhismanData
});
