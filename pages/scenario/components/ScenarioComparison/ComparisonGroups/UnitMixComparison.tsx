import { FC } from "react";
import classes from "../ScenarioComparison.module.scss";
import { ActualUnitMixHeaderMappings } from "utils/constants";
import { formatDataForDisplay } from "utils/units";
import { ScenarioComparisonModel } from "types/scenario";

interface Props {
  scenarioMetrics: ScenarioComparisonModel | undefined;
}

export const UnitMixComparison: FC<Props> = ({ scenarioMetrics }) => {
  const emptyComparisonCol = (label: string) => {
    return (
      <div className={classes.col}>
        <div className={classes.cell} key={label}>
          {label}
        </div>
        {ActualUnitMixHeaderMappings.map((mapping) => (
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
        <div className={classes.col} key={"col" + scenarioMetrics.scenarioId + "unitMetrics" + plot.label}>
          <div className={classes.cell} key={scenarioMetrics.scenarioId + "unitMetrics" + plot.label}>
            {plot.label}
          </div>
          {ActualUnitMixHeaderMappings.map((mapping) => {
            const actual = plot.plotMetrics.unitMetrics.find(
              (um) => um.unitType === mapping.key || um.unitType === mapping.altKey
            )?.yieldMixActual;

            return (
              <div className={classes.cell} key={scenarioMetrics.scenarioId + "unitMetrics" + plot.label + mapping.key}>
                {formatDataForDisplay(mapping.format, actual, mapping.decimalPlace)}
              </div>
            );
          })}
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
        <div className={classes.col} key={"col" + scenarioMetrics.scenarioId + "unitMetrics" + "scenario"}>
          <div className={classes.cell} key={scenarioMetrics.scenarioId + "unitMetrics" + "scenario"}>
            Scenario
          </div>
          {ActualUnitMixHeaderMappings.map((mapping) => {
            const actual = scenarioMetrics.siteMetrics.unitMetrics.find(
              (um) => um.unitType === mapping.key || um.unitType === mapping.altKey
            )?.yieldMixActual;

            return (
              <div className={classes.cell} key={scenarioMetrics.scenarioId + "unitMetrics" + "scenario" + mapping.key}>
                {formatDataForDisplay(mapping.format, actual, mapping.decimalPlace)}
              </div>
            );
          })}
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
