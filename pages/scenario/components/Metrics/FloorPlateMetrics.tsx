import React from "react";
import { formatDataForDisplay } from "utils/units";
import { toDecimalPlace } from "utils/strings";
import { FloorPlateMetrics } from "pages/configurator/data/v2/buildingDatav2";
import { SummaryItem } from "styling/components/SummaryItem/SummaryItem";
import { StepCard } from "styling/structuralComponents";
import { defaultMeasurementUnit, FormattingEnum } from "utils/constants";
import { useSelectedWorkspace } from "stores/workspaceStore";

type Props = {
  title: string;
  floorPlateMetrics: FloorPlateMetrics;
};
export const FloorPlateMetricsComponent = ({ title, floorPlateMetrics }: Props) => {
  const [selectedWorkspace] = useSelectedWorkspace();
  const { areaUnit } = selectedWorkspace?.measurement || defaultMeasurementUnit;

  const decimalPlace = 0;

  return (
    <StepCard title={title}>
      <SummaryItem
        name={"BOMA GEA"}
        value={formatDataForDisplay(areaUnit, floorPlateMetrics.bomagea, decimalPlace)}
        tooltip={"BOMA Gross Exterior Area"}
      />

      <SummaryItem
        name={`BOMA A`}
        value={formatDataForDisplay(areaUnit, floorPlateMetrics.bomaa, decimalPlace)}
        tooltip={"Unit Gross Area"}
      />

      <SummaryItem
        name={"BOMA B"}
        value={formatDataForDisplay(areaUnit, floorPlateMetrics.bomab, decimalPlace)}
        tooltip={"Unit Net Area"}
      />

      <SummaryItem
        name={"Residential GEA"}
        value={formatDataForDisplay(areaUnit, floorPlateMetrics.residentialGEA, decimalPlace)}
        tooltip={
          "The area required for the Residential Function including Living Unit Areas, Circulation, Common Areas, Amenities, Storage Cages, Service Dock, BOH, MEP&F etc."
        }
      />

      <SummaryItem
        name={`Residential Efficiency BOMA A`}
        value={formatDataForDisplay(
          FormattingEnum.Percentage,
          floorPlateMetrics.residentialEfficiencyBOMAA,
          decimalPlace
        )}
        tooltip={"BOMA A Area divided by Residential GEA expressed as a %."}
      />

      <SummaryItem
        name={`Residential Efficiency BOMA B`}
        value={formatDataForDisplay(
          FormattingEnum.Percentage,
          floorPlateMetrics.residentialEfficiencyBOMAB,
          decimalPlace
        )}
        tooltip={"BOMA B Area divided by Residential GEA expressed as a %."}
      />

      <SummaryItem
        name={"BOMA A/B Efficiency"}
        value={toDecimalPlace(floorPlateMetrics.bomaEfficiencyFactor, 2)}
        tooltip={"BOMA A divided by BOMA B"}
      />

      <SummaryItem
        name={"BOMA Efficiency Difference"}
        value={formatDataForDisplay(
          FormattingEnum.Percentage,
          floorPlateMetrics.bomaEfficiencyDifference,
          decimalPlace
        )}
        tooltip={
          "Residential Efficiency BOMA A minus Residential Efficiency BOMA B. This is a Whole of Building Comparison as Efficiency relates to Net over Gross."
        }
      />
    </StepCard>
  );
};
