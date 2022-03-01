import { getVerticesFromSpine } from "pages/configurator/components/utils";
import { BUILDING_MINWIDTH } from "pages/configurator/data/constants";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import { ConfiguratorAddObjectType, useConfiguratorToolsStore } from "pages/configurator/stores/configuratorToolsStore";
import { updateBoundaryMesh } from "pages/configurator/utilities/transformationUtils";
import { useEffect, useRef } from "react";
import { Mesh, Vector3 } from "three";
import { DrawObject } from "../../Transformations/Draw/DrawObject";
import shallow from "zustand/shallow";
import { useSelectedPlot } from "pages/configurator/stores/buildingServiceStoreSelectors";
import { materialLibrary } from "utils/materialLibrary";

export const AddObject = () => {
  const [, buildingServiceActions] = useV2BuildingServiceStore();
  const [selectedPlot] = useSelectedPlot();
  const objectHeight = 1;

  const [setConfigToolsMode, setObjectType] = useConfiguratorToolsStore(
    (state) => [state.setMode, state.setAddObjectType],
    shallow
  );

  const configToolsMode = useConfiguratorToolsStore((state) => state.mode);
  const objectType = useConfiguratorToolsStore((state) => state.addObjectType);

  const meshRef = useRef<Mesh>(null!);

  const drawObject = (vertices: Vector3[], commit: boolean = false) => {
    // use non-react state for rapid mutables
    useConfiguratorToolsStore.setState({ vertices });

    if (commit) {
      if (objectType === "Podium") {
        buildingServiceActions.addPlot(vertices);
      } else if (objectType === "LShape" || objectType === "Bar") {
        buildingServiceActions.addTower(vertices);
      }
      setConfigToolsMode("edit");
      setObjectType("none");
    }
  };

  useEffect(() => {
    // use non-react state for subscriptions
    return useConfiguratorToolsStore.subscribe(
      (vertices: Vector3[]) => {
        if (useConfiguratorToolsStore.getState().addObjectType === "Podium") {
          updateBoundaryMesh(meshRef.current, vertices, objectHeight);
        } else {
          const polygon = getVerticesFromSpine(vertices, BUILDING_MINWIDTH);
          updateBoundaryMesh(meshRef.current, polygon, objectHeight);
        }
      },
      (state) => state.vertices
    );
  }, []);

  // Below will be refactored when we fix up the draw object tool
  const getObjectZPosition = (objectType: ConfiguratorAddObjectType): number =>
    objectType === "Podium" || !selectedPlot
      ? 0
      : selectedPlot.podium.floorCount * selectedPlot.podium.floorToFloorHeight;

  if (configToolsMode !== "add") {
    return null;
  }

  return (
    <>
      {/** Below will be refactored when we fix up the draw object tool*/}
      <mesh
        ref={meshRef}
        material={materialLibrary.meshBasicMaterial_AddMassingObject}
        position-z={getObjectZPosition(objectType)}
      />

      {/** Below will be refactored when we fix up the draw object tool*/}
      <DrawObject
        updateGeometryFunction={drawObject}
        planeHeight={getObjectZPosition(objectType)}
        maxVertices={objectType === "Bar" ? 2 : objectType === "LShape" ? 3 : undefined}
        spineWidth={
          objectType === "Bar" || objectType === "LShape" || objectType === "gRPC" ? BUILDING_MINWIDTH : undefined
        }
      />
    </>
  );
};
