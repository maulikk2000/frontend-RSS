import { MutableRefObject, useEffect, useState } from "react";
import { Mesh, PlaneGeometry } from "three";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import { feetPerPixel } from "pages/configurator/components/utils";
import { useMapSettingsStore } from "pages/configurator/stores/mapSettingsStore";
import { materialLibrary } from "utils/materialLibrary";

type Props = {
  zPlane?: number;
  refObject: MutableRefObject<Mesh | undefined>;
};

export const DrawPlane = ({ zPlane = 0.2, refObject }: Props) => {
  const [mapSettings] = useMapSettingsStore();
  const [buildingService] = useV2BuildingServiceStore();

  const [ground, setGround] = useState<Mesh>();

  const longitude: number = buildingService.configuration?.longitude!;
  const latitude: number = buildingService.configuration?.latitude!;

  useEffect(() => {
    // offset Zoom for UI purposes
    const zoom: number = mapSettings.initialZoom;

    // Get Meters per Pixel
    const boxSize = mapSettings.pixelSize * feetPerPixel(latitude, zoom);

    const geometry: PlaneGeometry = new PlaneGeometry(boxSize, boxSize);

    const mapMesh: Mesh = new Mesh(geometry, materialLibrary.meshLambertMaterial_DrawPlane);

    setGround(mapMesh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [longitude, latitude, mapSettings.style]);

  return <>{ground && <primitive ref={refObject} object={ground} position={[0, 0, zPlane]} />}</>;
};
