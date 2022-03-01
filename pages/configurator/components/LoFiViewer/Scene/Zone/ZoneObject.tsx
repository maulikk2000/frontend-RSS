import { useEffect, useRef } from "react";
import { Mesh } from "three";
import { useSelectedProject } from "stores/projectStore";
import { CoordinateObject } from "../../Common/CoordinateObject";
import { useShadowDisplayStore } from "pages/configurator/stores/shadowDisplayStore";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import { createSiteBoundaryFromProject } from "pages/configurator/utilities/configurationUtils";
import { updateBoundaryMesh } from "pages/configurator/utilities/transformationUtils";
import { pointToVector3 } from "pages/configurator/components/utils";
import { materialLibrary } from "utils/materialLibrary";

export const ZoneObject = () => {
  const [buildingService] = useV2BuildingServiceStore();
  const [shadowDisplay] = useShadowDisplayStore();
  const zoneRef = useRef<Mesh>();
  const [selectedProject] = useSelectedProject();

  const zoneHeight = 0.1;

  useEffect(() => {
    if (!selectedProject) {
      return;
    }
    if (zoneRef.current) {
      if (!buildingService.configuration) {
        const boundary = createSiteBoundaryFromProject(selectedProject);
        updateBoundaryMesh(zoneRef.current, boundary.map(pointToVector3), zoneHeight);
      } else {
        updateBoundaryMesh(zoneRef.current, buildingService.configuration.boundary.map(pointToVector3), zoneHeight);
      }
    }
  }, [selectedProject?.coordinates, buildingService.configuration, buildingService.configuration?.boundary]);

  if (!selectedProject || !selectedProject.coordinates) {
    return null;
  }

  return (
    <>
      <CoordinateObject
        objectRef={zoneRef}
        coordinates={selectedProject!.coordinates}
        worldCoordinates={selectedProject!.siteWorldCoordinates}
        height={zoneHeight}
        material={materialLibrary.meshLambertMaterial_ZoneObject}
        receiveShadow={shadowDisplay.receiveShadows}
      />
    </>
  );
};
