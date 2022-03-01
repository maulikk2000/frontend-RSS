import { SolvedTower } from "pages/configurator/data/v2/buildingDatav2";
import React, { useEffect } from "react";
import { FloorMetricsComponent } from "./FloorMetrics";
import { FloorPlateMetricsComponent } from "./FloorPlateMetrics";
import { UnitMetricsComponent } from "./UnitMetrics";
import { defaultMeasurementUnit, FloorplateHeaderMappings, FormattingEnum } from "utils/constants";
import { getFloorMetrics, getMetricRows, getUnitMetricRows } from "../../utils/metricUtils";
import { useSelectedProject } from "stores/projectStore";
import { useSelectedWorkspace } from "stores/workspaceStore";
const dateFormat = require("dateformat");

type Props = {
  tower: SolvedTower;
  index: number;
  selectedPlot: string;
  setExportData: React.Dispatch<React.SetStateAction<string[][]>>;
  setCsvFileName: React.Dispatch<React.SetStateAction<string>>;
};

export const TowerMetrics: React.FC<Props> = ({ tower, index, selectedPlot, setExportData, setCsvFileName }) => {
  const [selectedProject] = useSelectedProject();
  const [selectedWorkspace] = useSelectedWorkspace();
  const measurementUnit = selectedWorkspace?.measurement || defaultMeasurementUnit;

  useEffect(() => {
    const exportFileName = `${dateFormat(Date.now(), "ddmmyyyy")}_${
      selectedProject ? selectedProject.name : ""
    }Plot_${selectedPlot}_Tower${index + 1}.csv`;

    const exportData = [
      ["Floorplate Metrics", ""],
      ...getMetricRows(FloorplateHeaderMappings(measurementUnit), "towerMetrics", tower.towerMetrics),
      ["Unit Metrics", ""],
      ...getUnitMetricRows(tower.towerMetrics.unitMetrics),
      ["Floor Metrics", ""],
      ...getFloorMetrics(tower.towerMetrics.floorMetrics, measurementUnit.areaUnit)
    ];
    setExportData(exportData);
    setCsvFileName(exportFileName);
  }, [tower.towerMetrics]);

  if (!tower! || !tower.towerMetrics || !tower.towerMetrics.towerMetrics) {
    return null;
  }

  return (
    <>
      <FloorPlateMetricsComponent
        title={`Tower ${index + 1} Floorplate Metrics`}
        floorPlateMetrics={tower.towerMetrics.towerMetrics}
      />
      <UnitMetricsComponent title={`Tower ${index + 1} Unit Metrics`} unitMetrics={tower.towerMetrics.unitMetrics} />
      <FloorMetricsComponent
        title={`Tower ${index + 1} Floor Metrics`}
        floorMetrics={tower.towerMetrics.floorMetrics}
      />
    </>
  );
};
