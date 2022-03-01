import { Feature } from "geojson";

// react-map-gl-draw doesn't give us the types we need at the moment,
// define them here for now.

export type EditorUpdateParams = {
  data: Feature[];
  editType: "addFeature" | "addTentativePosition" | "movePosition";
  editContext: {
    position?: number[];
    featureIndexes?: number[];
  };
};

export type EditorUpdateHandler = (params: EditorUpdateParams) => void;

export type EditorSelectParams = {
  selectedFeature: Feature | null;
  selectedFeatureIndex: number | null;
  mapCoords: number[];
  screenCoords: number[];
};

export type EditorSelectHandler = (params: EditorSelectParams) => void;
