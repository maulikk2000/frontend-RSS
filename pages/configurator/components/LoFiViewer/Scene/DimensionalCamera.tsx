import React, { useState, useEffect } from "react";
import { Vector3 } from "three";
import { OrthographicCamera, PerspectiveCamera } from "@react-three/drei";
import { useConfiguratorSettingsStore } from "pages/configurator/stores/configuratorSettingsStore";

export const DimensionalCamera = () => {
  const [configSettings] = useConfiguratorSettingsStore();

  const initialCamera = {
    position: new Vector3(0, 0, 1500),
    fov: 40,
    far: 20000,
    near: 10,
    up: new Vector3(0, 0, 1)
  };

  const [camera, setCamera] = useState<React.ReactNode>(
    <PerspectiveCamera makeDefault={true} applyMatrix4={undefined} {...initialCamera} />
  );

  useEffect(() => {
    if (!configSettings.is2D) {
      setCamera(<PerspectiveCamera makeDefault={true} applyMatrix4={undefined} {...initialCamera} />);
    } else {
      setCamera(
        <OrthographicCamera makeDefault={true} applyMatrix4={undefined} {...initialCamera}>
          <></>
        </OrthographicCamera>
      );
    }
  }, [configSettings.is2D]);

  return <>{camera}</>;
};
