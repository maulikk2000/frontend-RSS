import React, { useEffect, useRef, useState } from "react";
import { BUILDING_MAXLENGTH, BUILDING_MINLENGTH } from "pages/configurator/data/constants";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import { Tower } from "pages/configurator/data/v2/types";
import { getTowerBoundaryLength } from "pages/configurator/utilities/transformationUtils";
import { getArm1FromSpine, getArm2FromSpine, setArm1, setArm2 } from "pages/configurator/components/utils";
import { ConfiguredInputMetrics } from "../ConfiguredInputMetrics/ConfiguredInputMetrics";

type Props = {
  tower: Tower;
  unit: string;
};

export const ConfigureTowerFootprint = ({ tower, unit }: Props) => {
  const [, buildingServiceActions] = useV2BuildingServiceStore();

  const getArmValueFromSpine = (getArmValue: Function, tower: Tower) => {
    if (tower.spine.length > 2) {
      return getArmValue(tower.spine) + tower.width / 2;
    } else {
      return getArmValue(tower.spine);
    }
  };

  const [arm1Val, setArm1Val] = useState<number>(getArmValueFromSpine(getArm1FromSpine, tower));
  const [arm2Val, setArm2Val] = useState<number>(getArmValueFromSpine(getArm2FromSpine, tower));

  const arm1Ref = useRef<any>();
  const arm2Ref = useRef<any>();

  useEffect(() => {
    const arm1 = getArmValueFromSpine(getArm1FromSpine, tower);
    arm1Ref.current.value = `${arm1.toFixed(2)} ${unit}`;
    setArm1Val(arm1);

    if (tower.spine.length > 2) {
      const arm2 = getArmValueFromSpine(getArm2FromSpine, tower);
      arm2Ref.current.value = `${arm2.toFixed(2)} ${unit}`;
      setArm2Val(arm2);
    }
  }, [tower.spine]);

  let MINLENGTH = getTowerBoundaryLength(tower, BUILDING_MINLENGTH);
  let MAXLENGTH = getTowerBoundaryLength(tower, BUILDING_MAXLENGTH);

  const changeArm1 = (e, val) => {
    let distance = val;

    if (tower.spine.length > 2) {
      distance = distance - tower.width / 2;
    }
    const spine = setArm1(tower.spine, distance);
    arm1Ref.current.value = `${val.toFixed(2)} ${unit}`;
    return spine;
  };

  const changeArm2 = (e, val) => {
    let distance = val;

    if (tower.spine.length > 2) {
      distance = distance - tower.width / 2;
    }
    const spine = setArm2(tower.spine, distance);
    arm2Ref.current.value = `${val.toFixed(2)} ${unit}`;

    return spine;
  };

  const handleCommitArm1 = (e, val) => {
    const spine = changeArm1(e, val);
    buildingServiceActions.setSpine(spine);
  };

  const handleCommitArm2 = (e, val) => {
    const spine = changeArm2(e, val);
    buildingServiceActions.setSpine(spine);
  };

  return (
    <>
      <ConfiguredInputMetrics
        title={"Arm 1"}
        stateRef={arm1Ref}
        stateValue={arm1Val}
        setStateValue={setArm1Val}
        handleCommit={handleCommitArm1}
        min={MINLENGTH}
        max={MAXLENGTH}
        unit={unit}
      />

      {tower.spine.length > 2 && (
        <>
          <ConfiguredInputMetrics
            title={"Arm 2"}
            stateRef={arm2Ref}
            stateValue={arm2Val}
            setStateValue={setArm2Val}
            handleCommit={handleCommitArm2}
            min={MINLENGTH}
            max={MAXLENGTH}
            unit={unit}
          />
        </>
      )}
    </>
  );
};
