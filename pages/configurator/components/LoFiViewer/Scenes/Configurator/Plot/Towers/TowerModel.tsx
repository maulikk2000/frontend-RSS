import { useEffect, useMemo, useRef } from "react";
import { Mesh, MeshPhongMaterial } from "three";
import { Podium, Tower } from "pages/configurator/data/v2/types";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import { getSelectedObject } from "pages/configurator/utilities/configurationUtils";
import { createTowerGeometry } from "pages/configurator/components/utils";
import { TowerTransformations } from "./TowerTransformations";
import { useConfiguratorToolsStore } from "pages/configurator/stores/configuratorToolsStore";
import shallow from "zustand/shallow";

type Props = {
  tower: Tower;
  podium: Podium;
  towerIndex: number;
  plotIndex: number;
  material: MeshPhongMaterial;
  selectedMaterial: MeshPhongMaterial;
};

export const TowerModel = ({ tower, towerIndex, podium, plotIndex, material, selectedMaterial }: Props) => {
  const [buildingService, buildingServiceActions] = useV2BuildingServiceStore();

  const [configToolsMode, setConfigToolsMode] = useConfiguratorToolsStore(
    (state) => [state.mode, state.setMode],
    shallow
  );

  const selectedObject = getSelectedObject(buildingService);

  const isSelected = useMemo(() => {
    return (
      selectedObject.object === "tower" && selectedObject.index === towerIndex && selectedObject.plotIndex === plotIndex
    );
  }, [selectedObject]);

  const towerRef = useRef<Mesh>();

  useEffect(() => {
    if (towerRef.current && selectedObject.plotIndex === plotIndex && selectedObject.object !== "tower") {
      towerRef.current.visible = configToolsMode !== "add";
    }
  }, [configToolsMode === "add"]);

  useEffect(() => {
    let towerGeometry;

    towerGeometry = createTowerGeometry(tower.spine, tower.width, tower.floorToFloorHeight, tower.floorCount);

    if (towerGeometry && towerRef.current) {
      if (towerRef.current.geometry) towerRef.current.geometry.dispose();
      towerRef.current.geometry = towerGeometry;
    }
  }, [tower.spine, tower.floorCount, tower.floorToFloorHeight, tower.width]);

  const selectConfiguration = (e: any, towerIndex: number) => {
    e.stopPropagation();

    if (isSelected) {
      buildingServiceActions.clearSelectedObject();
      setConfigToolsMode("none");
    } else {
      buildingServiceActions.setSelectedObjectIndex("tower", towerIndex, plotIndex);
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
        name="Tower"
        ref={towerRef}
        onDoubleClick={(e) => selectConfiguration(e, towerIndex)}
        position-z={podium.floorCount * podium.floorToFloorHeight}
        receiveShadow={false}
        castShadow={true}
      />

      {towerRef.current && isSelected && <TowerTransformations towerRef={towerRef} tower={tower} podium={podium} />}
    </>
  );
};
