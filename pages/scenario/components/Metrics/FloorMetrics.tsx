import { FloorMetric } from "pages/configurator/data/v2/buildingDatav2";
import React from "react";
import { MetricTable } from "styling/structuralComponents/MetricTable/MetricTable";
import { StepCard } from "styling/structuralComponents/StepCard/StepCard";
import classes from "./Metrics.module.scss";
import { formatDataForDisplay, measurementUnitDisplay } from "utils/units";
import { zeroPad } from "utils/strings";
import { defaultMeasurementUnit, FormattingEnum } from "utils/constants";
import { useSelectedWorkspace } from "stores/workspaceStore";

type Props = {
  title: string;
  floorMetrics: FloorMetric[];
};
export const FloorMetricsComponent = ({ floorMetrics, title }: Props) => {
  const [selectedWorkspace] = useSelectedWorkspace();
  const { areaUnit } = selectedWorkspace?.measurement || defaultMeasurementUnit;

  const decimalPlace = 0;

  floorMetrics.sort((a, b) => parseFloat(a.level) - parseFloat(b.level));

  const getFloorLevel = (floorLevel: string) => {
    if (isNaN(parseInt(floorLevel) + 1)) {
      return parseInt(floorLevel.split("_")[1]) + 1;
    } else {
      return parseInt(floorLevel) + 1;
    }
  };

  return (
    <StepCard title={title}>
      <MetricTable hasTotal>
        <tbody>
          <tr>
            <th></th>
            <th>BOMA A NSA</th>
            <th>BOMA B NSA</th>
          </tr>
          {floorMetrics.map((floor, index) => (
            <tr key={index}>
              <td className={classes.floorLevelColumn}>Level {zeroPad(getFloorLevel(floor.level), 1)} </td>
              <td className={classes.floorMetricColumn}>
                {formatDataForDisplay(areaUnit, floor.bomaansa, decimalPlace)}
              </td>
              <td className={classes.floorMetricColumn}>
                {formatDataForDisplay(areaUnit, floor.bomabnsa, decimalPlace)}
              </td>
            </tr>
          ))}
        </tbody>
      </MetricTable>
    </StepCard>
  );
};
