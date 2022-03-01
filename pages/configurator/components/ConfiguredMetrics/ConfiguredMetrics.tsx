import {
  getCentroidFromCoordinates,
  coordinateToCartesian,
  cartesianToVector,
  getAreaFromPoints,
  getVerticesFromSpine
} from "pages/configurator/components/utils";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";

import { useEffect, useState } from "react";
import { useSelectedProject } from "stores/projectStore";
import { MassingMetrics } from "./MassingMetrics";
import { ConfiguredTowerMetrics } from "./ConfiguredTowerMetrics/ConfiguredTowerMetrics";
import { MetricsPanel } from "./MetricsPanel/MetricsPanel";
import { useSelectedWorkspace } from "stores/workspaceStore";
import { defaultMeasurementUnit } from "utils/constants";
import { measurementUnitDisplay } from "utils/units";
import { useSelectedPlot, useSelectedTower } from "pages/configurator/stores/buildingServiceStoreSelectors";

export const ConfiguredMetrics = () => {
  const [buildingService] = useV2BuildingServiceStore();
  const [selectedPlot] = useSelectedPlot();
  const [selectedTower] = useSelectedTower();

  const [buildingFootprints, setBuildingFootprints] = useState<number[]>();
  const [residentialGFAs, setResidentialGFAs] = useState<number[]>();
  const [podiumGFAs, setPodiumGFAs] = useState<number[]>();

  const [selectedProject] = useSelectedProject();
  const [siteArea, setSiteArea] = useState<number>(0);

  const [selectedWorkspace] = useSelectedWorkspace();
  const measurementUnit = selectedWorkspace?.measurement ?? defaultMeasurementUnit;

  const plots = buildingService.configuration?.plots;

  useEffect(() => {
    if (selectedProject && selectedProject.coordinates) {
      const origin = getCentroidFromCoordinates(selectedProject.coordinates);
      const zonePoints = selectedProject.coordinates.map((coordinate) => {
        let cartesian = coordinateToCartesian(coordinate, origin!, measurementUnitDisplay[measurementUnit.lengthUnit]);
        return cartesianToVector(cartesian);
      });
      const zoneArea = getAreaFromPoints(zonePoints) ?? 0;
      setSiteArea(zoneArea);
    }
  }, [selectedProject?.coordinates]);

  useEffect(() => {
    let residentialGFAs: number[] = [];
    let buildingFootprints: number[] = [];
    let podiumGFAs: number[] = [];

    if (!plots) return;

    for (const plot of plots) {
      const podiumArea = getAreaFromPoints(plot.podium.boundary) ?? 0;
      let buildingFootprint: number = 0;
      let residentialGFA: number = 0;
      plot.towers.map((tower) => {
        let area = getAreaFromPoints(getVerticesFromSpine(tower.spine, tower.width)!);
        if (area) {
          buildingFootprint += area;
          residentialGFA += area * tower.floorCount;
        }
      });

      let podiumGFA: number = 0;
      if (podiumArea) {
        podiumGFA = podiumArea * plot.podium.floorCount;
      }

      residentialGFAs.push(residentialGFA);
      buildingFootprints.push(buildingFootprint);
      podiumGFAs.push(podiumGFA);
    }

    setBuildingFootprints(buildingFootprints);
    setPodiumGFAs(podiumGFAs);
    setResidentialGFAs(residentialGFAs);
  }, [buildingService.configuration]);

  if (!buildingService.configuration) {
    return null;
  }

  return (
    <>
      {selectedPlot && (
        <MetricsPanel title={"Plot Metrics"}>
          <MassingMetrics
            siteArea={siteArea}
            podiumArea={getAreaFromPoints(selectedPlot.podium.boundary)}
            buildingFootprint={buildingFootprints?.[buildingService.selectedPlotIndex]}
            residentialGFA={residentialGFAs?.[buildingService.selectedPlotIndex]}
            podiumGFA={podiumGFAs?.[buildingService.selectedPlotIndex]}
          />
        </MetricsPanel>
      )}

      {selectedTower && (
        <MetricsPanel title={"Tower Metrics"}>
          <ConfiguredTowerMetrics tower={selectedTower} />
        </MetricsPanel>
      )}
    </>
  );
};
