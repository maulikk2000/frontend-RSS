import { radiansToDegrees } from "@turf/turf";
import { useMapSettingsStore } from "pages/configurator/stores/mapSettingsStore";
import { useRapidMutableStore } from "pages/configurator/stores/zustand/rapidMutables";
import { useEffect, useRef } from "react";
import NorthSvg from "styling/assets/icons/maptools_north.svg";

import classes from "../MapControlPanel.module.scss";

export const Compass = () => {
  const compassRef = useRef<HTMLImageElement>(null!);
  const [, mapSettingsActions] = useMapSettingsStore();

  useEffect(
    () =>
      useRapidMutableStore.subscribe(
        (sceneAzimuthalAngle: number) =>
          (compassRef.current.style.transform = `rotate(${radiansToDegrees(sceneAzimuthalAngle)}deg)`),
        (state) => state.sceneAzimuthalAngle
      ),
    []
  );

  return (
    <div
      className={classes.navigation}
      data-title="North"
      onClick={() => {
        mapSettingsActions.setReturnToNorth(true);
      }}
    >
      <img ref={compassRef} src={NorthSvg} alt="North" />
    </div>
  );
};
