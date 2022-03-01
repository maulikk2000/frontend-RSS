import React from "react";

import { MoveablePanel } from "../MoveablePanel/MoveablePanel";
import { SunSimulation } from "./SunSimulation/SunSimulation";
import { MeasurementsTool } from "./MeasurementsTool/MeasurementsTool";
import { PanelDivider } from "../MoveablePanel/PanelDivider/PanelDivider";

type Props = {
  isDocked: boolean;
  setIsDocked: React.Dispatch<React.SetStateAction<boolean>>;
};
export const SolvedExplorePanel = ({ isDocked, setIsDocked }: Props) => {
  return (
    <MoveablePanel isDocked={isDocked} setIsDocked={setIsDocked}>
      <SunSimulation isDocked={isDocked} />
      <PanelDivider />
      <MeasurementsTool isDocked={isDocked} />
    </MoveablePanel>
  );
};
