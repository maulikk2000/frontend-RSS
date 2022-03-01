import { useEffect } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { Vector3 } from "three";
import { useMapSettingsStore } from "pages/configurator/stores/mapSettingsStore";
import { getCentreOfVectors, pointToVector3 } from "../../../utils";
import { OrbitalControl } from "../OrbitalControl";
import { useConfiguratorSettingsStore } from "pages/configurator/stores/configuratorSettingsStore";
import { useMeshReferenceStore } from "pages/configurator/stores/meshReferenceStore";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import { useRapidMutableStore } from "pages/configurator/stores/zustand/rapidMutables";
import { useSelectedPlot } from "pages/configurator/stores/buildingServiceStoreSelectors";

export const OrbitalControlsWrapper = () => {
  const [meshRefs] = useMeshReferenceStore();
  const [mapSettings, mapSettingsActions] = useMapSettingsStore();
  const [buildingService] = useV2BuildingServiceStore();
  const [configSettings] = useConfiguratorSettingsStore();

  const [selectedPlot] = useSelectedPlot();

  let { camera, gl } = useThree();

  const orbit = meshRefs.orbitRef?.current;

  // Get World Direction from Orbit Controls
  // Our static map has no rotation therefore
  // the map always points north
  useFrame(() => {
    if (!meshRefs.orbitRef || !orbit || !meshRefs.orbitRef.current) {
      return;
    }

    const azimuthalAngle = meshRefs.orbitRef.current.getAzimuthalAngle();
    useRapidMutableStore.setState({ sceneAzimuthalAngle: azimuthalAngle });

    if (mapSettings.returnToNorth) {
      meshRefs.orbitRef.current.enabled = false;
      meshRefs.orbitRef.current.autoRotate = true;
      meshRefs.orbitRef.current.autoRotateSpeed = azimuthalAngle * 40;
      if (Math.abs(azimuthalAngle) < 0.01) {
        meshRefs.orbitRef.current.enabled = true;
        mapSettingsActions.setReturnToNorth(false);
      }
    }
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const setSceneCentroid = () => {
    if (!buildingService.configuration) {
      return;
    }
    const podium = selectedPlot?.podium;
    const height = podium ? podium.floorCount * podium.floorToFloorHeight : 300;

    // Get Centroid of Podium and Attach to Orbital Target
    const centroid = getCentreOfVectors(
      podium ? podium.boundary : buildingService.configuration.boundary.map(pointToVector3)
    );

    if (meshRefs.orbitRef && orbit) {
      if (!configSettings.is2D) {
        let vector = new Vector3(120, -711.8397153882691, 310.58962855976745);

        meshRefs.orbitRef.current.object.position.x = vector.x;
        meshRefs.orbitRef.current.object.position.y = vector.y;
        meshRefs.orbitRef.current.object.position.z = vector.z;

        let target = centroid;
        target.z = height / 2;
        meshRefs.orbitRef.current.target = target;
      } else {
        meshRefs.orbitRef.current.object.position.set(centroid.x, 1000, centroid.z);
      }
    }
  };

  useEffect(() => {
    setSceneCentroid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSceneCentroid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapSettings.returnToCenter, configSettings.is2D]);

  return (
    <>
      {meshRefs.orbitRef && (
        <OrbitalControl is2D={configSettings.is2D} orbit={meshRefs.orbitRef} camera={camera} gl={gl} />
      )}
    </>
  );
};
