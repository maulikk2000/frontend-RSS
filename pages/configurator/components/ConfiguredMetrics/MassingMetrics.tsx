import { formatDataForDisplay } from "utils/units";
import { useSelectedWorkspace } from "stores/workspaceStore";
import { SummaryItem } from "styling/components";
import { defaultMeasurementUnit, FormattingEnum } from "utils/constants";

type Props = {
  siteArea?: number;
  podiumArea?: number;
  buildingFootprint?: number;
  residentialGFA?: number;
  podiumGFA?: number;
};

export const MassingMetrics = ({
  siteArea = 0,
  podiumArea = 0,
  buildingFootprint = 0,
  residentialGFA = 0,
  podiumGFA = 0
}: Props) => {
  const [selectedWorkspace] = useSelectedWorkspace();
  const { areaUnit } = selectedWorkspace?.measurement || defaultMeasurementUnit;

  return (
    <>
      <SummaryItem name={"Site Area"} value={formatDataForDisplay(areaUnit, siteArea, 2)} />

      <SummaryItem name={`Building Footprint`} value={formatDataForDisplay(areaUnit, buildingFootprint, 2)} />

      <SummaryItem
        name={"Site Coverage Ratio"}
        value={formatDataForDisplay(FormattingEnum.Percentage, podiumArea / siteArea, 2)}
      />

      <SummaryItem name={"Open Space"} value={formatDataForDisplay(areaUnit, siteArea - podiumArea, 2)} />

      <SummaryItem name={`Residential GFA`} value={formatDataForDisplay(areaUnit, residentialGFA, 2)} />

      <SummaryItem name={`Podium GFA`} value={formatDataForDisplay(areaUnit, podiumGFA, 2)} />

      <SummaryItem name={"Total GFA"} value={formatDataForDisplay(areaUnit, podiumGFA + residentialGFA, 2)} />
    </>
  );
};
