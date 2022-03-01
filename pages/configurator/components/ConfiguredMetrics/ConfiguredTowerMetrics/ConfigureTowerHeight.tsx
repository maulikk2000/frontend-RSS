import React, { useEffect, useRef, useState } from "react";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import { Tower } from "pages/configurator/data/v2/types";
import { ConfiguredInputMetrics } from "../ConfiguredInputMetrics/ConfiguredInputMetrics";
import { SummaryItem } from "styling/components";

type Props = {
  tower: Tower;
  unit: string;
};

export const ConfigureTowerHeight = ({ tower, unit }: Props) => {
  const [, buildingServiceActions] = useV2BuildingServiceStore();

  const [floorCount, setFloorCount] = useState<number>(tower.floorCount);

  const floorCountRef = useRef<any>();

  useEffect(() => {
    floorCountRef.current.value = tower.floorCount.toFixed(0);
    setFloorCount(tower.floorCount);
  }, [tower.floorToFloorHeight, tower.floorCount]);

  const handleCommitFloorCount = (e, val) => {
    buildingServiceActions.setStandardFloorCount(val);
  };

  return (
    <>
      <ConfiguredInputMetrics
        title={"Floor Count"}
        stateRef={floorCountRef}
        stateValue={floorCount}
        setStateValue={setFloorCount}
        handleCommit={handleCommitFloorCount}
        min={1}
        max={100}
        unit={""}
      />
      <SummaryItem name="Floor Height" value={`${tower.floorToFloorHeight} ${unit}`} />
    </>
  );
};
