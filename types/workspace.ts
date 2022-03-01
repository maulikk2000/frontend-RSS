import { FormattingEnum } from "utils/constants";
import { ApiCallStoreState } from "./extensions/apiCallStateExtension";
import { MessageStoreState } from "./extensions/messageExtension";
import { GeoJSON } from "geojson";

export enum WorkspaceUnitSystem {
  Metric = 0,
  Imperial
}

export type Measurement = {
  areaUnit: FormattingEnum;
  largeAreaUnit: FormattingEnum;
  lengthUnit: FormattingEnum;
};

export type ParcelSelctionLayer = {
  id: string;
  name: string;
  url: string;
  featureDisplayNameProperty: string;
};

export type Workspace = {
  id: string;
  name: string;
  unitSystem: number;
  measurement?: Measurement;
  userGroup?: string;
  description?: string;
  regions?: string[];
  parcelSelectionMapLayer?: ParcelSelctionLayer | null;
};

export type Masterplans = {
  [workspaceId: string]: GeoJSON.FeatureCollection;
};

export type WorkspaceStoreState = MessageStoreState &
  ApiCallStoreState & {
    workspaces: Workspace[];
    selectedWorkSpace: string;
    selectedWorkspaceId: string;
    masterplans?: Masterplans;
  };
