import { FC } from "react";
import classes from "../ScenarioComparison.module.scss";
import { MetricsMapping } from "utils/constants";
import { formatDataForDisplay } from "utils/units";
import { ScenarioComparisonModel } from "types/scenario";

interface Props {
  scenarioMetrics: ScenarioComparisonModel | undefined;
  metricsMappings: MetricsMapping[];
  plotMetricPropertyName: "floorPlateMetrics" | "massingMetrics";
}

export const MetricsComparison: FC<Props> = ({ scenarioMetrics, metricsMappings, plotMetricPropertyName }) => {
  const emptyComparisonCol = (label: string) => {
    return (
      <div className={classes.col}>
        <div className={classes.cell} key={label}>
          {label}
        </div>
        {metricsMappings.map((mapping) => (
          <div className={classes.cell} key={label + mapping.label}>
            -
          </div>
        ))}
      </div>
    );
  };

  const plotMetricsColumns = () => {
    if (scenarioMetrics && scenarioMetrics.plots && scenarioMetrics.plots.length > 0) {
      return scenarioMetrics.plots.map((plot) => (
        <div className={classes.col} key={"col" + scenarioMetrics.scenarioId + plotMetricPropertyName + plot.label}>
          <div className={classes.cell} key={scenarioMetrics.scenarioId + plotMetricPropertyName + plot.label}>
            {plot.label}
          </div>
          {metricsMappings.map((mapping) => (
            <div
              className={classes.cell}
              key={scenarioMetrics.scenarioId + plotMetricPropertyName + plot.label + mapping.key}
            >
              {formatDataForDisplay(
                mapping.format,
                plot.plotMetrics[plotMetricPropertyName][mapping.key],
                mapping.decimalPlace
              )}
            </div>
          ))}
        </div>
      ));
    } else {
      return (
        <>
          {emptyComparisonCol("R1")}
          {emptyComparisonCol("R2")}
        </>
      );
    }
  };

  const siteMetricsColumn = () => {
    if (
      scenarioMetrics &&
      scenarioMetrics.siteMetrics &&
      scenarioMetrics.siteMetrics.unitMetrics &&
      scenarioMetrics.siteMetrics.unitMetrics.length > 0
    ) {
      return (
        <div className={classes.col} key={"col" + scenarioMetrics.scenarioId + plotMetricPropertyName + "scenario"}>
          <div className={classes.cell} key={scenarioMetrics.scenarioId + plotMetricPropertyName + "scenario"}>
            Scenario
          </div>
          {metricsMappings.map((mapping) => (
            <div
              className={classes.cell}
              key={scenarioMetrics.scenarioId + plotMetricPropertyName + "scenario" + mapping.key}
            >
              {formatDataForDisplay(
                mapping.format,
                scenarioMetrics.siteMetrics[plotMetricPropertyName][mapping.key],
                mapping.decimalPlace
              )}
            </div>
          ))}
        </div>
      );
    } else {
      return emptyComparisonCol("Scenario");
    }
  };

  return (
    <>
      {plotMetricsColumns()}
      {siteMetricsColumn()}
    </>
  );
};
