import { incalculableUnits, formatDataForDisplay } from "utils/units";
import { percentage } from "utils/strings";
import { MassingMetrics } from "pages/configurator/data/v2/buildingDatav2";
import { SummaryItem } from "styling/components/SummaryItem/SummaryItem";
import { StepCard } from "styling/structuralComponents/StepCard/StepCard";
import { defaultMeasurementUnit, FormattingEnum } from "utils/constants";
import { useSelectedWorkspace } from "stores/workspaceStore";

type Props = {
  title: string;
  massingMetrics: MassingMetrics;
};
export const MassingMetricsComponent = ({ massingMetrics, title }: Props) => {
  const [selectedWorkspace] = useSelectedWorkspace();
  const { areaUnit, largeAreaUnit } = selectedWorkspace?.measurement || defaultMeasurementUnit;

  const decimalPlace = 0;

  const siteCoverageRatio = percentage(massingMetrics.siteCoverageRatio, 1, decimalPlace);

  return (
    <StepCard title={title}>
      <SummaryItem name={"Site Area"} value={formatDataForDisplay(areaUnit, massingMetrics.siteArea, decimalPlace)} />

      <SummaryItem
        name={`Building Footprint`}
        value={formatDataForDisplay(areaUnit, massingMetrics.buildingFootPrint, decimalPlace)}
      />

      <SummaryItem
        name={`Tower Footprint`}
        value={formatDataForDisplay(areaUnit, massingMetrics.towerFootPrint, decimalPlace)}
      />

      <SummaryItem
        name={`Podium Footprint`}
        value={formatDataForDisplay(areaUnit, massingMetrics.podiumFootPrint, decimalPlace)}
      />

      <SummaryItem
        name={"Site Coverage Ratio"}
        value={incalculableUnits(siteCoverageRatio.toString()) ? "N/A" : siteCoverageRatio}
      />

      <SummaryItem name={"Open Space"} value={formatDataForDisplay(largeAreaUnit, massingMetrics.openSpace, 2)} />

      <SummaryItem
        name={`Massing Residential GEA`}
        value={formatDataForDisplay(areaUnit, massingMetrics.residentialGEA, decimalPlace)}
      />

      <SummaryItem name={`Podium GEA`} value={formatDataForDisplay(areaUnit, massingMetrics.podiumGEA, decimalPlace)} />

      <SummaryItem name={"Total GEA"} value={formatDataForDisplay(areaUnit, massingMetrics.totalGEA, decimalPlace)} />
    </StepCard>
  );
};
