import { SolvedPlot } from "pages/configurator/data/v2/buildingDatav2";
import React, { useEffect } from "react";
import { FloorPlateMetricsComponent } from "./FloorPlateMetrics";
import { MassingMetricsComponent } from "./MassingMetrics";
import { UnitMetricsComponent } from "./UnitMetrics";
import { useSelectedProject } from "stores/projectStore";
import { defaultMeasurementUnit, FloorplateHeaderMappings, MassingMetricsHeaderMappings } from "utils/constants";
import { getMetricRows, getUnitMetricRows } from "../../utils/metricUtils";
import { useSelectedScenarios } from "stores/scenarioStore";
import { useSelectedWorkspace } from "stores/workspaceStore";

const dateFormat = require("dateformat");

type Props = {
  solvedPlot: SolvedPlot;
  setExportData: React.Dispatch<React.SetStateAction<string[][]>>;
  setCsvFileName: React.Dispatch<React.SetStateAction<string>>;
};

export const PlotMetrics: React.FC<Props> = ({ solvedPlot, setExportData, setCsvFileName }) => {
  const [selectedProject] = useSelectedProject();
  const [selectedScenarios] = useSelectedScenarios();
  const [selectedWorkspace] = useSelectedWorkspace();
  const measurementUnit = selectedWorkspace?.measurement || defaultMeasurementUnit;

  useEffect(() => {
    const exportFileName = `${dateFormat(Date.now(), "ddmmyyyy")}_${selectedProject ? selectedProject.name : ""}_${
      selectedScenarios.length > 0 ? selectedScenarios[0].name : ""
    }_Plot_${solvedPlot.label}.csv`;

    const exportData = [
      ["Massing Metrics", ""],
      ...getMetricRows(MassingMetricsHeaderMappings(measurementUnit), "massingMetrics", solvedPlot.plotMetrics),
      ["Floorplate Metrics", ""],
      ...getMetricRows(FloorplateHeaderMappings(measurementUnit), "floorPlateMetrics", solvedPlot.plotMetrics),
      ["Unit Metrics", ""],
      ...getUnitMetricRows(solvedPlot.plotMetrics.unitMetrics)
    ];
    setExportData(exportData);
    setCsvFileName(exportFileName);
  }, [solvedPlot.plotMetrics]);

  return (
    <>
      <MassingMetricsComponent
        title={`${solvedPlot.label} Massing Metrics`}
        massingMetrics={solvedPlot.plotMetrics.massingMetrics}
      />
      <FloorPlateMetricsComponent
        title={`${solvedPlot.label} Floorplate Metrics`}
        floorPlateMetrics={solvedPlot.plotMetrics.floorPlateMetrics}
      />
      <UnitMetricsComponent
        title={`${solvedPlot.label} Unit Metrics`}
        unitMetrics={solvedPlot.plotMetrics.unitMetrics}
      />
    </>
  );
};
