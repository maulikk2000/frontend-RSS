import { useRapidMutableStore } from "pages/configurator/stores/zustand/rapidMutables";
import { useEffect, useMemo, useRef } from "react";
import { useSimulationStore } from "stores/simulationStore";
import classes from "./PageLoader.module.scss";

export type Props = {
  title?: string;
};

export const LoadStatus = ({ title }: Props) => {
  const loaderRef = useRef<HTMLDivElement>(null!);
  const [simulationStore] = useSimulationStore();

  const titleText = useMemo(() => {
    if (simulationStore.selectedSimulationAnalysis?.isDataLoading) {
      return `Preparing ${simulationStore.selectedSimulationAnalysis?.type} Analysis`;
    }
    if (useRapidMutableStore.getState().gltfLoadPercentage === null) {
      return `Configuring Scene`;
    }
  }, [useRapidMutableStore.getState().gltfLoadPercentage, simulationStore.selectedSimulationAnalysis]);

  useEffect(
    () =>
      useRapidMutableStore.subscribe(
        (gltfLoadPercentage: number | null) =>
          (loaderRef.current.innerText = `Loading Building ${gltfLoadPercentage?.toFixed(0)}%`),
        (state) => state.gltfLoadPercentage
      ),
    []
  );

  return (
    <div className={classes.title} ref={loaderRef}>
      {titleText ?? title}
    </div>
  );
};
