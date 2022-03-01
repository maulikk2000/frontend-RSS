import create, { StoreApi } from "zustand/vanilla";
import { SHADOWCONTEXTDATE } from "pages/configurator/data/constants";

type RapidMutablesType = {
  skyDate: Date;
  sceneAzimuthalAngle: number;
  gltfLoadPercentage: number | null;
};

const initialState: RapidMutablesType = {
  skyDate: SHADOWCONTEXTDATE,
  sceneAzimuthalAngle: 0,
  gltfLoadPercentage: null
};

export const useRapidMutableStore: StoreApi<RapidMutablesType> = create((): RapidMutablesType => initialState);
