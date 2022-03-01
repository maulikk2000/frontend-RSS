import { createStore, createHook } from "react-sweet-state";
import { massingMapConfig as mapConfig } from "utils/mapConstants";
import { MapSettingsStoreState } from "../data/types";

export type MapSettingsActions = typeof actions;

const initialState: MapSettingsStoreState = {
  initialZoom: 15.5,
  pitch: 60,
  style: mapConfig.styles.basic,
  displayMap: true,
  opaqueBuilding: false,
  pixelSize: 1200,
  sceneCentralPoint: null,
  returnToCenter: 0,
  returnToNorth: false,
  loadedNeighbouringBuildings: null,
  showNeighbouringBuildings: true
};

const actions = {
  setStyle: (style) => ({ setState }) => {
    setState({
      style
    });
  },

  setToken: (token) => ({ setState }) => {
    setState({
      token
    });
  },

  setPitch: (pitch) => ({ setState }) => {
    setState({
      pitch
    });
  },

  setOpaqueBuilding: (opaqueBuilding) => ({ setState }) => {
    setState({
      opaqueBuilding
    });
  },

  setDisplayMap: (displayMap: boolean) => ({ setState }) => {
    setState({
      displayMap
    });
  },

  setSceneCentralPoint: (sceneCentralPoint) => ({ setState }) => {
    setState({
      sceneCentralPoint
    });
  },

  setReturnToCenter: (returnToCenter) => ({ setState }) => {
    setState({
      returnToCenter
    });
  },

  setReturnToNorth: (returnToNorth) => ({ setState }) => {
    setState({
      returnToNorth
    });
  },

  setPixelSize: (pixelSize: number) => ({ setState }) => {
    setState({
      pixelSize
    });
  },

  setLoadedNeighbouringBuildings: (loadedNeighbouringBuildings: boolean | null | undefined) => ({ setState }) => {
    setState({
      loadedNeighbouringBuildings
    });
  },

  setShowNeighbouringBuildings: (show: boolean) => ({ setState, getState }) => {
    setState({
      showNeighbouringBuildings: show
    });
  },

  clearMapSettingsStore: () => ({ setState }) => {
    setState({
      ...initialState
    });
  }
};

const MapSettingsStore = createStore<MapSettingsStoreState, MapSettingsActions>({
  initialState,
  actions,
  name: "Map Settings Store"
});

export const useMapSettingsStore = createHook(MapSettingsStore);
