import { useConfiguratorSettingsStore } from "pages/configurator/stores/configuratorSettingsStore";
import { useLayerDisplayStore } from "pages/configurator/stores/layerDisplayStore";
import { createThreeJSObjectFromGeoJSONFeature } from "pages/configurator/utilities/overpassUtils";
import { useEffect, useState } from "react";
import { useProjectStore, useSelectedProject } from "stores/projectStore";
import { ExtrudeBufferGeometry, Mesh, MeshBasicMaterial } from "three";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";
import { feetToMetres } from "../../../utils";
import { addLayerIds } from "./complianceLayerUtils";

export const ComplianceLayers = () => {
  const [projectState] = useProjectStore();
  const [configSettings] = useConfiguratorSettingsStore();
  const [layerDisplayState] = useLayerDisplayStore();
  const [objects, setObjects] = useState<Mesh[]>([]);
  const [selectedProject] = useSelectedProject();

  useEffect(() => {
    const newObjects: Mesh[] = [];
    if (!selectedProject || !selectedProject.siteWorldCoordinates || !projectState.selectedProjectPlanning) {
      return;
    }

    projectState.selectedProjectPlanning.forEach((plan, index) => {
      const geometryMesh = new Mesh();
      const geometries: ExtrudeBufferGeometry[] = [];
      let height = feetToMetres(plan.height) ?? 10;

      addLayerIds(plan, geometryMesh);

      plan.geoJson.features.forEach((feature) => {
        if (!configSettings.is2D) {
          feature.properties!.height = height;
        } else {
          feature.properties!.height = 0.2;
        }
        const geometry = createThreeJSObjectFromGeoJSONFeature(
          feature,
          [selectedProject.siteWorldCoordinates[0], selectedProject.siteWorldCoordinates[1]],
          {
            curveSegments: 0,
            bevelEnabled: true,
            bevelSegments: 1,
            bevelSize: 0.5,
            bevelThickness: 0.1
          }
        );

        if (geometry) {
          const zFlickerOffset = index / 10;
          geometry.translate(0, 0, zFlickerOffset);
          geometries.push(geometry);
        }
      });

      const geometry = BufferGeometryUtils.mergeBufferGeometries(geometries);
      geometryMesh.geometry = geometry;
      let geometryMaterial = new MeshBasicMaterial({
        color: `#${plan.colour}`,
        opacity: 0.6,
        transparent: true,
        polygonOffset: true,
        polygonOffsetFactor: index / 10,
        polygonOffsetUnits: index / 10
      });
      geometryMesh.material = geometryMaterial;
      geometryMesh.renderOrder = index;

      newObjects.push(geometryMesh);
    });

    setObjects(newObjects);

    return () => {
      objects.forEach((mesh) => {
        mesh.geometry.dispose();
      });
    };
  }, [configSettings, projectState.selectedProjectPlanning]);

  return objects && projectState.selectedProjectPlanning ? (
    <>
      {objects.map((mesh, index) => (
        <primitive key={index} object={mesh} visible={layerDisplayState.complianceLayers[mesh.userData.id]} />
      ))}
    </>
  ) : null;
};
