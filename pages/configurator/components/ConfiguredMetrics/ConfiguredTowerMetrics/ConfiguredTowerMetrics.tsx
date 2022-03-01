import { getAreaFromPoints, getVerticesFromSpine } from "pages/configurator/components/utils";
import { formatDataForDisplay, measurementUnitDisplay } from "utils/units";
import { Tower } from "pages/configurator/data/v2/types";
import { SummaryItem } from "styling/components";
import { ConfigureTowerFootprint } from "./ConfigureTowerFootprint";
import { ConfigureTowerHeight } from "./ConfigureTowerHeight";
import { useSelectedWorkspace } from "stores/workspaceStore";
import { defaultMeasurementUnit } from "utils/constants";

type Props = {
  tower: Tower;
};

export const ConfiguredTowerMetrics = ({ tower }: Props) => {
  const [selectedWorkspace] = useSelectedWorkspace();
  const measurementUnit = selectedWorkspace?.measurement || defaultMeasurementUnit;

  const area = getAreaFromPoints(getVerticesFromSpine(tower.spine, tower.width)!)!;

  return (
    <>
      <ConfigureTowerFootprint tower={tower} unit={measurementUnitDisplay[measurementUnit.lengthUnit]} />
      <ConfigureTowerHeight tower={tower} unit={measurementUnitDisplay[measurementUnit.lengthUnit]} />
      <SummaryItem name={`Width`} value={formatDataForDisplay(measurementUnit.lengthUnit, tower.width, 2)} />

      <SummaryItem name={`Tower Footprint`} value={formatDataForDisplay(measurementUnit.areaUnit, area, 2)} />

      <SummaryItem
        name={`Residential GFA`}
        value={formatDataForDisplay(measurementUnit.areaUnit, area * tower.floorCount, 2)}
      />
    </>
  );
};
