import produce from "immer";
import { createHook, createStore } from "react-sweet-state";
import { ComplianceIds, LayerDisplayState } from "../data/types";

type Actions = typeof actions;

const initialState: LayerDisplayState = {
  displayParcel: true,
  displayMapPlane: true,
  complianceLayers: {
    maxHeightAllBuildings: false,
    maxHeightHighRiseCore: false,
    setBack: false
  }
};

const actions = {
  setParcelDisplay: (displayParcel: boolean) => ({ setState, getState }) => {
    setState({
      displayParcel
    });
  },

  setMapPlaneDisplay: (displayMapPlane: boolean) => ({ setState, getState }) => {
    setState({
      displayMapPlane
    });
  },

  showComplianceLayer: (id: ComplianceIds, isVisible: boolean) => ({ getState, setState }) => {
    produce(getState(), (draft: LayerDisplayState) => {
      setState({
        complianceLayers: {
          ...draft.complianceLayers,
          [id]: isVisible
        }
      });
    });
  }
};

const layerDisplayStore = createStore<LayerDisplayState, Actions>({
  initialState,
  actions,
  name: "Layer Display Store"
});

export const useLayerDisplayStore = createHook(layerDisplayStore);
