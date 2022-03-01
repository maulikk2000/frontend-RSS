import { SiteMetrics } from "pages/configurator/data/v2/buildingDatav2";
import React, { useEffect } from "react";
import { FloorPlateMetricsComponent } from "./FloorPlateMetrics";
import { MassingMetricsComponent } from "./MassingMetrics";
import { UnitMetricsComponent } from "./UnitMetrics";
import { useSelectedProject } from "stores/projectStore";
import { useSelectedScenarios } from "stores/scenarioStore";
import { defaultMeasurementUnit, FloorplateHeaderMappings, MassingMetricsHeaderMappings } from "utils/constants";
import { getMetricRows, getUnitMetricRows } from "../../utils/metricUtils";
import { useSelectedWorkspace } from "stores/workspaceStore";
const dateFormat = require("dateformat");

type Props = {
  siteMetrics: SiteMetrics;
  setExportData: React.Dispatch<React.SetStateAction<string[][]>>;
  setCsvFileName: React.Dispatch<React.SetStateAction<string>>;
};

export const ScenarioMetrics: React.FC<Props> = ({ siteMetrics, setExportData, setCsvFileName }) => {
  const [selectedProject] = useSelectedProject();
  const [selectedScenarios] = useSelectedScenarios();
  const [selectedWorkspace] = useSelectedWorkspace();
  const measurementUnit = selectedWorkspace?.measurement || defaultMeasurementUnit;

  useEffect(() => {
    const exportFileName = `${dateFormat(Date.now(), "ddmmyyyy")}_${selectedProject ? selectedProject.name : ""}_${
      selectedScenarios.length > 0 ? selectedScenarios[0].name : ""
    }.csv`;

    const exportData = [
      ["Massing Metrics", ""],
      ...getMetricRows(MassingMetricsHeaderMappings(measurementUnit), "massingMetrics", siteMetrics),
      ["Floorplate Metrics", ""],
      ...getMetricRows(FloorplateHeaderMappings(measurementUnit), "floorPlateMetrics", siteMetrics),
      ["Unit Metrics", ""],
      ...getUnitMetricRows(siteMetrics.unitMetrics)
    ];
    setExportData(exportData);
    setCsvFileName(exportFileName);
  }, [siteMetrics]);

  return (
    <>
      <MassingMetricsComponent title={"Scenario Massing Metrics"} massingMetrics={siteMetrics.massingMetrics} />
      <FloorPlateMetricsComponent
        title={"Scenario Floorplate Metrics"}
        floorPlateMetrics={siteMetrics.floorPlateMetrics}
      />
      <UnitMetricsComponent title={"Scenario Unit Metrics"} unitMetrics={siteMetrics.unitMetrics} />
    </>
  );
};
