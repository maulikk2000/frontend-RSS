import { createStore, createHook, StoreActionApi } from "react-sweet-state";
import { MapLayers, MapStoreState, MapLayerIds, MapLayer, DrawLayerStatus } from "types/map";
import { ToggleItem } from "styling/components/LayerToggleControls";

export type Actions = typeof actions;
type StoreApi = StoreActionApi<MapStoreState>;

const MapLayerOptions: MapLayers = {
  [MapLayerIds.Projects]: {
    id: MapLayerIds.Projects,
    name: "Show Projects In Map",
    isOn: true,
    group: "secondary"
  },
  [MapLayerIds.ThreeDBuildings]: {
    id: MapLayerIds.ThreeDBuildings,
    name: "3D Buildings",
    isOn: true,
    group: "primary",
    order: 2
  },
  [MapLayerIds.Satellite]: {
    id: MapLayerIds.Satellite,
    name: "Satellite Imagery",
    isOn: false,
    group: "primary",
    order: 3
  }
};

const initialState: MapStoreState = {
  showGetStartedCard: false,
  showCreateProjectModal: false,
  showSiteDetailModal: false,
  showDeleteProjectModal: false,
  drawLayerStatus: undefined,
  mapLayers: MapLayerOptions
};

const actions = {
  setShowGetStartedCard: (showGetStartedCard: boolean) => ({ setState }) => {
    setState({ showGetStartedCard });
  },

  setShowCreateProjectModal: (showCreateProjectModal: boolean) => ({ setState }) => {
    setState({ showCreateProjectModal });
  },

  setShowSiteDetailModal: (showSiteDetailModal: boolean) => ({ setState }) => {
    setState({ showSiteDetailModal });
  },

  setShowDeleteProjectModal: (showDeleteProjectModal: boolean) => ({ setState }) => {
    setState({ showDeleteProjectModal });
  },

  setDrawLayerStatus: (drawLayerStatus: DrawLayerStatus) => ({ setState }) => {
    setState({ drawLayerStatus });
  },

  reset: () => ({ setState }) => {
    setState({ ...initialState });
  },

  getMapLayer: (id: string) => ({ getState }: StoreApi) => {
    return getState().mapLayers?.[id];
  },

  toggleMapLayer: (id: string) => ({ getState, setState }: StoreApi) => {
    const mapLayers = {
      ...getState().mapLayers
    };
    const activeLayer = mapLayers?.[id];
    mapLayers[id] = {
      ...activeLayer,
      isOn: !activeLayer?.isOn
    };
    setState({
      mapLayers
    });
  },

  getMapLayers: () => ({ getState }: StoreApi): MapLayer[] => {
    return Object.values(getState().mapLayers);
  },

  registerLayer: (layer: ToggleItem) => ({ getState, setState }: StoreApi) => {
    const mapLayers = {
      ...getState().mapLayers,
      [layer.id]: layer
    };
    setState({ mapLayers });
  }
};

const mapStore = createStore<MapStoreState, Actions>({
  initialState,
  actions,
  name: "Map Store"
});

export const useMapStore = createHook(mapStore);
