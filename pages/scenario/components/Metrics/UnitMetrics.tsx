import React, { memo } from "react";

import { percentage } from "utils/strings";
import { UnitMetric } from "pages/configurator/data/v2/buildingDatav2";
import { getNameFromGDVUnitType, getOrderedGDVUnitTypes } from "pages/scenario/utils/apartmentUtils";
import { MetricTable } from "styling/structuralComponents/MetricTable/MetricTable";
import { StepCard } from "styling/structuralComponents/StepCard/StepCard";
import classes from "./Metrics.module.scss";

type UnitTypeDictionary = { [unitType: string]: UnitMetric };

type Props = {
  title: string;
  unitMetrics: UnitMetric[];
};

export const UnitMetricsComponent = memo(({ unitMetrics, title }: Props) => {
  const decimalPlace = 1;

  const yieldTotal: number = unitMetrics.reduce((accumulator, mix) => accumulator + mix.yield, 0);

  const percentTargetTotal: number = unitMetrics.reduce((accumulator, mix) => accumulator + mix.yieldMixTarget, 0);

  const percentActualTotal: number = unitMetrics.reduce((accumulator, mix) => accumulator + mix.yieldMixActual, 0);

  const isLastRow = (index) => {
    return index === unitMetrics.length - 1 ? " " + classes.lastRow : "";
  };

  const unitTypes = [...new Set(unitMetrics.map((unitMetric) => unitMetric.unitType))];
  const sortedUnits = getOrderedGDVUnitTypes(unitTypes);

  const unitDictionary: UnitTypeDictionary = {};
  for (const unit of unitMetrics) {
    unitDictionary[unit.unitType] = unit;
  }

  return (
    <StepCard title={title}>
      <MetricTable hasTotal>
        <tbody>
          <tr>
            <th></th>
            <th>Yield</th>
            <th>Actual</th>
            <th>Target</th>
          </tr>
          {sortedUnits.map((unit, index) => (
            <tr key={index} className={isLastRow(index)}>
              <td>{getNameFromGDVUnitType(unitDictionary[unit].unitType)}</td>
              <td>{unitDictionary[unit].yield}</td>
              <td>{percentage(unitDictionary[unit].yieldMixActual, 1, decimalPlace)}</td>
              <td>{percentage(unitDictionary[unit].yieldMixTarget, 1, decimalPlace)}</td>
            </tr>
          ))}
          <tr className={classes.totalRow}>
            <td>
              <b>Total</b>
            </td>
            <td>{yieldTotal}</td>
            <td>{percentage(percentActualTotal, 1, 0)}</td>
            <td>{percentage(percentTargetTotal, 1, 0)}</td>
          </tr>
        </tbody>
      </MetricTable>
    </StepCard>
  );
});
