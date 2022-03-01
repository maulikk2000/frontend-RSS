import { memo, useCallback, useEffect, useState } from "react";
import { Vector3 } from "three";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import { useSelectedScenarios } from "stores/scenarioStore";
import { getLabelPosition, getCentreOfTowerSpaces } from "pages/configurator/utilities/transformationUtils";
import { HtmlMarkers } from "./HtmlMarkers/HtmlMarkers";
import { ConfiguratorObjects, getSelectedObject } from "pages/configurator/utilities/configurationUtils";
import { useIsManualEastWhismanData } from "pages/configurator/stores/buildingServiceStoreSelectors";

type ItemLabel = {
  title: string;
  position: Vector3;
  type: ConfiguratorObjects;
  plotIndex?: number;
  objectIndex?: number;
  scaleFactor: number;
};

export const PlotLabels = memo(() => {
  const [buildingService] = useV2BuildingServiceStore();
  const [selectedScenarios] = useSelectedScenarios();

  const [isManualEastwhismanData] = useIsManualEastWhismanData();

  const [labels, setLabels] = useState<ItemLabel[]>([]);

  const selectedObject = getSelectedObject(buildingService);

  const displayLabel = useCallback(
    (label: ItemLabel) => {
      if (
        selectedObject.object === label.type &&
        selectedObject.plotIndex === label.plotIndex &&
        selectedObject.index === label.objectIndex
      ) {
        return true;
      } else {
        return false;
      }
    },
    [selectedObject]
  );

  useEffect(() => {
    const labels: ItemLabel[] = [];
    const scenarioPosition = new Vector3(0, 0, 180);
    const scenarioLabel: ItemLabel = {
      title: selectedScenarios.length > 0 ? selectedScenarios[0].name : "",
      position: scenarioPosition,
      type: null,
      scaleFactor: 1000
    };

    labels.push(scenarioLabel);

    // check for two types of building data, manually solved East Whisman and automatically solved Envision solvers
    if (isManualEastwhismanData) {
      // site has no tower spine for manually solved buildings so we create off the configuration
      buildingService.configuration!.plots.forEach((plot, plotIndex) => {
        const plotPosition = getLabelPosition(plot);
        const labelItem: ItemLabel = {
          title: plot.label,
          position: plotPosition,
          type: "plot",
          plotIndex,
          objectIndex: plotIndex,
          scaleFactor: 800
        };
        labels.push(labelItem);

        plot.towers.forEach((tower, towerIndex) => {
          const towerPosition = getCentreOfTowerSpaces(tower);

          const labelItem: ItemLabel = {
            title: `Tower ${towerIndex + 1}`,
            position: towerPosition,
            type: "tower",
            plotIndex,
            objectIndex: towerIndex,
            scaleFactor: 600
          };
          labels.push(labelItem);
        });
      });
    } else {
      // envision generated solved buildings have no podium so we use configuration for podium
      buildingService.configuration!.plots.forEach((plot, plotIndex) => {
        const plotPosition = getLabelPosition(plot);
        const labelItem: ItemLabel = {
          title: plot.label,
          position: plotPosition,
          type: "plot",
          plotIndex,
          objectIndex: plotIndex,
          scaleFactor: 800
        };
        labels.push(labelItem);
      });

      buildingService.building!.plots.forEach((plot, plotIndex) => {
        plot.building.towers.forEach((tower, towerIndex) => {
          const towerPosition = getCentreOfTowerSpaces(tower as any);

          const labelItem: ItemLabel = {
            title: `Tower ${towerIndex + 1}`,
            position: towerPosition,
            type: "tower",
            plotIndex,
            objectIndex: towerIndex,
            scaleFactor: 600
          };
          labels.push(labelItem);
        });
      });
    }

    setLabels(labels);
  }, [selectedScenarios]);

  return (
    <>
      {labels.map(
        (label, labelIndex) =>
          displayLabel(label) && (
            <mesh key={labelIndex} position={label.position}>
              <HtmlMarkers translateY={"0px"} classType={"label"} scaleFactor={label.scaleFactor}>
                <div
                  style={{
                    whiteSpace: "nowrap"
                  }}
                >
                  {label.title}
                </div>
              </HtmlMarkers>
            </mesh>
          )
      )}
    </>
  );
});
