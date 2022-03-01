import { useEffect, useMemo, useRef } from "react";
import { MeshPhongMaterial, Mesh } from "three";
import { createThreeJSObjectFromVectors } from "../../../../../utils";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import { Plot } from "pages/configurator/data/v2/types";
import { getSelectedObject } from "pages/configurator/utilities/configurationUtils";
import { PodiumTransformations } from "./PodiumTransformations";
import { useConfiguratorToolsStore } from "pages/configurator/stores/configuratorToolsStore";

type Props = {
  plot: Plot;
  plotIndex: number;
  material: MeshPhongMaterial;
  selectedMaterial: MeshPhongMaterial;
};

export const PodiumModel = ({ plot, plotIndex, material, selectedMaterial }: Props) => {
  const [buildingService, buildingServiceActions] = useV2BuildingServiceStore();

  const setConfigToolsMode = useConfiguratorToolsStore((state) => state.setMode);

  const podiumRef = useRef<Mesh>();
  const podium = { ...plot.podium };

  const isSelected = useMemo(() => {
    const selectedObject = getSelectedObject(buildingService);
    return (
      (selectedObject.object === "podium" || selectedObject.object === "plot") &&
      selectedObject.index === plotIndex &&
      selectedObject.plotIndex === plotIndex
    );
  }, [buildingService.selectedObjectIndex, buildingService.selectedPlotIndex]);

  useEffect(() => {
    const podiumGeometry = createThreeJSObjectFromVectors(
      podium.boundary,
      podium.floorCount * podium.floorToFloorHeight
    );

    if (podiumGeometry && podiumRef.current) {
      if (podiumRef.current.geometry) podiumRef.current.geometry.dispose();

      podiumRef.current.geometry = podiumGeometry;
    }
  }, [podium.boundary, podium.floorToFloorHeight, podium.floorCount]);

  const selectPodium = (e: any) => {
    e.stopPropagation();

    if (isSelected) {
      buildingServiceActions.clearSelectedObject();
      setConfigToolsMode("none");
    } else {
      buildingServiceActions.setSelectedObjectIndex("plot", plot.towers.length, plotIndex);
      setConfigToolsMode("edit");
    }
  };

  const getMaterial = () => {
    if (isSelected) {
      return selectedMaterial;
    } else {
      return material;
    }
  };

  return (
    <>
      <mesh
        material={getMaterial()}
        ref={podiumRef}
        castShadow={true}
        receiveShadow={true}
        onDoubleClick={selectPodium}
        renderOrder={0}
      />

      {podiumRef.current && isSelected && <PodiumTransformations podiumRef={podiumRef} plot={plot} />}
    </>
  );
};
