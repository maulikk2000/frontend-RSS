import { useRef } from "react";
import { Mesh } from "three";
import { metresToFeet } from "../../utils";
import { useSelectedProject } from "stores/projectStore";
import { useConfiguratorToolsStore } from "pages/configurator/stores/configuratorToolsStore";
import { useLayerDisplayStore } from "pages/configurator/stores/layerDisplayStore";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import { CONFIGURATOR_STATE } from "pages/configurator/data/enums";
import { CoordinateObject } from "../Common/CoordinateObject";
import { materialLibrary } from "utils/materialLibrary";

export const EnvelopeObject = () => {
  const [layerDisplay] = useLayerDisplayStore();
  const [buildingService] = useV2BuildingServiceStore();
  const [selectedProject] = useSelectedProject();

  const configToolsMode = useConfiguratorToolsStore((state) => state.mode);

  const envelopeRef = useRef<Mesh>();

  if (buildingService.status === CONFIGURATOR_STATE.SOLVED) {
    return null;
  }

  if (
    !selectedProject ||
    !selectedProject.envelopeCoordinates ||
    configToolsMode === "draw" ||
    !layerDisplay.displayParcel
  ) {
    return null;
  }

  return (
    <>
      <CoordinateObject
        objectRef={envelopeRef}
        coordinates={selectedProject.envelopeCoordinates}
        worldCoordinates={selectedProject.siteWorldCoordinates}
        height={metresToFeet(selectedProject.envelopeHeight!)}
        material={materialLibrary.meshBasicMaterial_EnvelopCoordinateObject}
      />
    </>
  );
};
