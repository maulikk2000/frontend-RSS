import { useEffect, useRef } from "react";
import classes from "./SunAnimation.module.scss";
import { useRapidMutableStore } from "pages/configurator/stores/zustand/rapidMutables";

export const SunSimulationDate = () => {
  const dateDivRef = useRef<HTMLDivElement>(null!);

  useEffect(
    () =>
      useRapidMutableStore.subscribe(
        (skyDate: Date) => (dateDivRef.current.innerText = skyDate.toUTCString().split("GMT")[0]),
        (state) => state.skyDate
      ),
    []
  );

  return (
    <div className={classes.timeAnimationText} ref={dateDivRef}>
      {useRapidMutableStore.getState().skyDate.toUTCString().split("GMT")[0]}
    </div>
  );
};
