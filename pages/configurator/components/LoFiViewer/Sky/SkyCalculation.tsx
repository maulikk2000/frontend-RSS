import { MutableRefObject, useEffect } from "react";
import { DirectionalLight } from "three";
import { calculateSunPosition } from "./skyUtils";
import Sky from "./Sky";
import { useRapidMutableStore } from "pages/configurator/stores/zustand/rapidMutables";

type Props = {
  skyRef: MutableRefObject<Sky>;
  lightRef: MutableRefObject<DirectionalLight>;
  coordinates: number[];
  utcOffset: number;
};

export const SkyCalculation = ({ skyRef, lightRef, coordinates, utcOffset }: Props) => {
  useEffect(() => {
    return useRapidMutableStore.subscribe(() =>
      calculateSunPosition(coordinates, useRapidMutableStore.getState().skyDate, lightRef, skyRef, utcOffset)
    );
  }, []);
  return <></>;
};
