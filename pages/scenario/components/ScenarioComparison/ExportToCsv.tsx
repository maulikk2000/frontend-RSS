import { FC, useEffect, useState } from "react";
import {
  MetricsMapping,
  FloorplateHeaderMappings,
  MassingMetricsHeaderMappings,
  ActualUnitMixHeaderMappings,
  defaultMeasurementUnit
} from "utils/constants";
import { formatDataForDisplay } from "utils/units";
import { useSelectedProject } from "stores/projectStore";
import CsvButton from "styling/components/CsvButton/CsvButton";
import { ScenarioComparisonModel } from "types/scenario";
import { useScenarioStore } from "stores/scenarioStore";
import { useSelectedWorkspace } from "stores/workspaceStore";
var dateFormat = require("dateformat");

export const ExportToCsv: FC<{
  scenarioComparisonsToExport: (ScenarioComparisonModel | undefined)[];
}> = ({ scenarioComparisonsToExport }) => {
  const [exportDisabled, setExportDisabled] = useState<boolean>(false);
  const [exportData, setExportData] = useState<string[][]>([]);
  const [exportFileName, setExportFileName] = useState("");
  const [selectedProject] = useSelectedProject();
  const [scenarioStore] = useScenarioStore();
  const [selectedWorkspace] = useSelectedWorkspace();
  const measurementUnit = selectedWorkspace?.measurement || defaultMeasurementUnit;

  useEffect(() => {
    setExportDisabled(true);

    if (scenarioComparisonsToExport.length > 0 && scenarioComparisonsToExport.some((e) => e !== undefined)) {
      setExportData(translateToCsvDataRows());
      setExportDisabled(false);
    }

    if (!exportFileName) {
      setExportFileName(getFileName());
    }
  }, [scenarioComparisonsToExport]);

  useEffect(() => {
    setExportFileName(getFileName());
  }, [selectedProject]);

  const getFileName = (): string => {
    const now = new Date();
    return dateFormat(now, "ddmmyyyy ") + selectedProject?.name + " Scenario Comparison.csv";
  };

  const translateToCsvDataRows = (): string[][] => {
    const result: string[][] = [getHeaderRow()].concat(
      [getSubHeaderRow("Massing Metrics", true)],
      getMetricRows(MassingMetricsHeaderMappings(measurementUnit), "massingMetrics"),
      [getSubHeaderRow("Floorplate Metrics", false)],
      getMetricRows(FloorplateHeaderMappings(measurementUnit), "floorPlateMetrics"),
      [getSubHeaderRow("Unit Mix", false)],
      getUnitMixRows()
    );

    return result;
  };

  const getHeaderRow = (): string[] => {
    const result: string[] = [];
    result.push("Scenario Name", "");

    var firstScenarioData = scenarioComparisonsToExport.find((d) => d !== undefined) as ScenarioComparisonModel;
    if (firstScenarioData) {
      const totalNoOfPlotsWithSiteMetrics =
        (firstScenarioData.plots && firstScenarioData.plots.length > 1 ? firstScenarioData.plots.length : 1) + 1;
      scenarioComparisonsToExport.forEach((scenario) => {
        if (scenario) {
          const name = scenarioStore.scenarios.find((sl) => sl.id === scenario.scenarioId)?.name;
          for (let i = 0; i < totalNoOfPlotsWithSiteMetrics; i++) {
            result.push(name ?? "");
          }
          result.push("");
        }
      });
    }
    return result;
  };

  const getSubHeaderRow = (rowHeading: string, showMetricsLabel: boolean): string[] => {
    const result: string[] = [];
    result.push(rowHeading, "");

    scenarioComparisonsToExport.forEach((scenario) => {
      if (scenario) {
        if (scenario.plots && scenario.plots.length > 0) {
          scenario.plots.forEach((p) => {
            result.push(showMetricsLabel ? p.label : "");
          });
        } else {
          result.push("");
        }
        result.push(showMetricsLabel ? "Scenario" : "");
        result.push("");
      }
    });
    return result;
  };

  const getMetricRows = (mappings: MetricsMapping[], metricsPropertyName): string[][] => {
    const result: string[][] = [];

    mappings.forEach((mapping) => {
      const row: string[] = [];
      row.push(mapping.label, "");

      scenarioComparisonsToExport.forEach((scenario) => {
        if (scenario) {
          if (scenario.plots && scenario.plots.length > 0) {
            scenario.plots.forEach((p) => {
              row.push(formatDataForDisplay(mapping.format, p.plotMetrics[metricsPropertyName][mapping.key]));
            });
          } else {
            row.push("");
          }
          row.push(
            scenario.siteMetrics
              ? formatDataForDisplay(mapping.format, scenario.siteMetrics[metricsPropertyName][mapping.key])
              : ""
          );
          row.push("");
        }
      });
      result.push(row);
    });

    return result;
  };

  const getUnitMixRows = (): string[][] => {
    const result: string[][] = [];

    ActualUnitMixHeaderMappings.forEach((mapping) => {
      const row: string[] = [];
      row.push(mapping.label, "");

      scenarioComparisonsToExport.forEach((scenario) => {
        if (scenario) {
          if (scenario.plots && scenario.plots.length > 0) {
            scenario.plots.forEach((p) => {
              const actual = p.plotMetrics.unitMetrics.find(
                (um) => um.unitType === mapping.key || um.unitType === mapping.altKey
              )?.yieldMixActual;
              row.push(actual ? formatDataForDisplay(mapping.format, actual) : "");
            });
          } else {
            row.push("");
          }

          const actual =
            scenario.siteMetrics && scenario.siteMetrics.unitMetrics
              ? scenario.siteMetrics.unitMetrics.find(
                  (um) => um.unitType === mapping.key || um.unitType === mapping.altKey
                )?.yieldMixActual
              : undefined;
          row.push(actual ? formatDataForDisplay(mapping.format, actual) : "");
          row.push("");
        }
      });

      result.push(row);
    });

    return result;
  };

  return <CsvButton data={exportData} filename={exportFileName} isDisabled={exportDisabled} />;
};
