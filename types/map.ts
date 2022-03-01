import { ApiCallStoreState } from "./extensions/apiCallStateExtension";
import { MessageStoreState } from "./extensions/messageExtension";

export const MapLayerIds = {
  Masterplan: "masterplan",
  Projects: "projects",
  ThreeDBuildings: "threedbuildings",
  Satellite: "satellite",
  ParcelSelection: "parcelSelection"
};

export type MapLayer = {
  id: string;
  name: string;
  isOn: boolean;
  group?: string;
  order?: number;
};

export type MapLayers = {
  [layerId: string]: MapLayer;
};

export type DrawLayerStatus = "saved" | "unsaved" | undefined;

export type MapStoreState = MessageStoreState &
  ApiCallStoreState & {
    showGetStartedCard: boolean;
    showCreateProjectModal: boolean;
    showSiteDetailModal: boolean;
    showDeleteProjectModal: boolean;
    drawLayerStatus?: DrawLayerStatus;
    mapLayers: MapLayers;
  };
