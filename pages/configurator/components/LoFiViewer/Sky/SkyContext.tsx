import { useEffect, useRef, useState } from "react";
import { Vector3, AmbientLight, DirectionalLight } from "three";
import { useShadowDisplayStore } from "pages/configurator/stores/shadowDisplayStore";
import { useSelectedProject } from "stores/projectStore";
import { calculateSunPosition, calculateUTCOffset } from "./skyUtils";
import Sky from "./Sky";
import { useControls } from "leva";
import { SkyAnimation } from "./SkyAnimation";
import { useConfiguratorSettingsStore } from "pages/configurator/stores/configuratorSettingsStore";
import { useRapidMutableStore } from "pages/configurator/stores/zustand/rapidMutables";
import { SkyCalculation } from "./SkyCalculation";

export const SkyContext = () => {
  const DISTANCE = 500;
  const initialPosition = new Vector3(0, -DISTANCE, 50);
  const { x, y, z } = initialPosition;

  const skyRef = useRef<Sky>(new Sky());
  const lightRef = useRef<DirectionalLight>(new DirectionalLight(0xffffff, 1));

  const [configSettings] = useConfiguratorSettingsStore();
  const [shadowDisplay] = useShadowDisplayStore();
  const [selectedProject] = useSelectedProject();

  let coordinates: number[] = selectedProject ? selectedProject.siteWorldCoordinates : [];

  const [utcOffset] = useState<number>(calculateUTCOffset(coordinates, useRapidMutableStore.getState().skyDate));

  useEffect(() => {
    if (skyRef.current && lightRef.current) {
      const skyCurrent = skyRef.current;
      const lightCurrent = lightRef.current;

      if (skyCurrent && lightCurrent) {
        lightCurrent.position.set(x, y, z);
        skyCurrent.scale.setScalar(2500);

        const lightCamera = lightCurrent.shadow.camera;

        lightCamera.near = 1;
        lightCamera.far = 2000;
        lightCamera.left = -500;
        lightCamera.bottom = -500;
        lightCamera.right = 500;
        lightCamera.top = 500;

        lightCurrent.castShadow = true;
        skyCurrent.castShadow = true;

        const reduceShadowArtifacts = -0.0001;
        lightCurrent.shadow.bias = reduceShadowArtifacts;
        lightCurrent.shadow.radius = 2;

        lightCurrent.shadow.mapSize.width = 2048;
        lightCurrent.shadow.mapSize.height = 2048;
      }
    }

    calculateSunPosition(coordinates, useRapidMutableStore.getState().skyDate, lightRef, skyRef, utcOffset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { showShadowCasterDebug, ambientColour, ambientIntensity } = useControls(
    "Lighting",
    {
      showShadowCasterDebug: false,
      ambientColour: "#FFFFFF",
      ambientIntensity: 0.4
    },
    { collapsed: true }
  );

  return (
    <>
      {!shadowDisplay.receiveShadows && <primitive object={new AmbientLight(0x8d8d8d)} />}

      <directionalLight visible={shadowDisplay.receiveShadows} ref={lightRef} position={lightRef.current.position} />
      {showShadowCasterDebug && <cameraHelper args={[lightRef.current.shadow.camera]} />}

      {configSettings.animateSun && lightRef.current && <SkyAnimation minutesPerMS={2} />}
      <ambientLight color={ambientColour} intensity={ambientIntensity} castShadow={false} />
      {<primitive ref={skyRef} object={skyRef.current} />}

      <SkyCalculation skyRef={skyRef} lightRef={lightRef} coordinates={coordinates} utcOffset={utcOffset} />
    </>
  );
};
