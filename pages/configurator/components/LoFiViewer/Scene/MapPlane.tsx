import { useEffect, useState } from "react";
import { useMapSettingsStore } from "../../../stores/mapSettingsStore";
import { feetPerPixel } from "../../utils";
import { MeshLambertMaterial, Mesh, TextureLoader, LinearFilter, CircleGeometry, CylinderGeometry } from "three";
import { useShadowDisplayStore } from "pages/configurator/stores/shadowDisplayStore";
import { useLayerDisplayStore } from "pages/configurator/stores/layerDisplayStore";
import { useSelectedProject } from "stores/projectStore";
import { materialLibrary } from "utils/materialLibrary";
import { massingMapConfig } from "utils/mapConstants";

export const MapPlane = () => {
  const [mapSettings] = useMapSettingsStore();
  const [layerDisplay] = useLayerDisplayStore();
  const [shadowDisplay] = useShadowDisplayStore();
  const [mapPlane, setMapPlane] = useState<Mesh>();
  const [floor, setFloor] = useState<Mesh>();
  const [selectedProject] = useSelectedProject();

  const pixelSize = mapSettings.pixelSize;

  const floorHeight: number = 0.5;

  useEffect(() => {
    if (!layerDisplay.displayMapPlane) {
      return;
    }

    if (!selectedProject || !selectedProject.siteWorldCoordinates[1]) {
      return;
    }

    // offset Zoom for UI purposes
    const zoom: number = mapSettings.initialZoom;

    // Get Meters per Pixel
    const radius = (pixelSize * feetPerPixel(selectedProject!.siteWorldCoordinates[1], zoom)) / 2;

    const geometry: CircleGeometry = new CircleGeometry(radius, 64);
    const floor: CylinderGeometry = new CylinderGeometry(radius, radius, floorHeight, 64);

    const staticMapImageLoader = new TextureLoader();

    const staticMapImageURL: string =
      "https://api.mapbox.com/styles/v1/" +
      massingMapConfig.user +
      "/" +
      mapSettings.style +
      "/static/" +
      selectedProject!.siteWorldCoordinates[0] +
      "," +
      selectedProject!.siteWorldCoordinates[1] +
      "," +
      zoom +
      "," +
      0 +
      ",0.00/" +
      pixelSize +
      "x" +
      pixelSize +
      "@2x?access_token=" +
      massingMapConfig.token;

    const mapMaterial: MeshLambertMaterial = new MeshLambertMaterial({
      map: staticMapImageLoader.load(staticMapImageURL)
    });

    // Max out the resolution of the image
    if (mapMaterial.map) {
      mapMaterial.map.minFilter = LinearFilter;
    }

    const mapMesh: Mesh = new Mesh(geometry, mapMaterial);
    const floorMesh: Mesh = new Mesh(floor, materialLibrary.meshBasicMaterial_MapPlaneFloor);

    setMapPlane(mapMesh);
    setFloor(floorMesh);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject?.siteWorldCoordinates, mapSettings.style, mapSettings.pixelSize]);

  const onHover = (e) => {
    e.stopPropagation();
  };

  // Return early when map plane is toggled off
  if (!layerDisplay.displayMapPlane) {
    return null;
  }

  return (
    <>
      {mapPlane && (
        <>
          <primitive
            receiveShadow={shadowDisplay.receiveShadows}
            object={mapPlane}
            position={[0, 0, 0]}
            onPointerOver={(e) => onHover(e)}
            visible={mapSettings.displayMap}
          />

          <primitive
            receiveShadow={shadowDisplay.receiveShadows}
            castShadow={true}
            object={floor}
            position={[0, 0, -0.5]}
            rotation={[Math.PI / 2, 0, 0]}
            visible={mapSettings.displayMap}
          />
        </>
      )}
    </>
  );
};
