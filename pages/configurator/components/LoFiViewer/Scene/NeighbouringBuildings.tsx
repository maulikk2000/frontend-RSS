import { memo, useEffect, useState } from "react";
import { useMapSettingsStore } from "pages/configurator/stores/mapSettingsStore";
import { metersPerPixel } from "../../utils";
import { BufferGeometry } from "three";
import { useShadowDisplayStore } from "pages/configurator/stores/shadowDisplayStore";
import { useProjectStore, useSelectedProject } from "stores/projectStore";
import { createThreeJSObjectFromGeoJSONFeature, getOverpassData } from "pages/configurator/utilities/overpassUtils";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";
import { polygon, booleanDisjoint } from "@turf/turf";
import { MessageState } from "types/extensions/messageExtension";
import { materialLibrary } from "utils/materialLibrary";

type Props = {
  worldCoordinates: number[] | undefined;
};

export const NeighbouringBuildings = memo(({ worldCoordinates }: Props) => {
  const [, projectStoreActions] = useProjectStore();
  const [mapSettings, mapSettingsActions] = useMapSettingsStore();
  const [shadowDisplay] = useShadowDisplayStore();
  const [geometry, setGeometry] = useState<BufferGeometry | null>();
  const [selectedProject] = useSelectedProject();
  const [longitude, latitude] = worldCoordinates ?? [0, 0];

  useEffect(() => {
    let isSubscribed = true;
    if (
      !selectedProject ||
      mapSettings.loadedNeighbouringBuildings !== null ||
      mapSettings.loadedNeighbouringBuildings === undefined
    ) {
      return;
    }

    (async function createNeighbouring() {
      const mapRadius = (mapSettings.pixelSize * metersPerPixel(latitude, mapSettings.initialZoom)) / 2;

      const zoneGeometry = polygon([selectedProject!.coordinates!]);

      try {
        const overpassData = await getOverpassData(
          [longitude, latitude],
          mapRadius * 0.9, // Scale down so buildings arent loaded that are hanging off the boundary
          `"building"`
        );

        if (!isSubscribed) {
          // Hook has been unmounted before data returned. Dont go further
          return;
        }

        const geometries = overpassData.features
          // Ignore buildings that intersect the zone.
          .filter((feature) => booleanDisjoint(feature, zoneGeometry))
          .map((feature) =>
            createThreeJSObjectFromGeoJSONFeature(feature, [longitude, latitude], {
              curveSegments: 0,
              bevelEnabled: true,
              bevelSegments: 1,
              bevelSize: 0.5,
              bevelThickness: 0.1
            })
          );

        setGeometry(BufferGeometryUtils.mergeBufferGeometries(geometries));
      } catch (error) {
        console.error(error);
        projectStoreActions.setMessageState({
          text: "Error loading surrounding buildings",
          variant: "error"
        });
      } finally {
        mapSettingsActions.setLoadedNeighbouringBuildings(true);
      }
    })();
    return () => {
      isSubscribed = false;
    };
  }, [mapSettings.loadedNeighbouringBuildings]);

  useEffect(() => {
    // buildings load again after being removed when unmounting this component
    return () => {
      mapSettingsActions.setLoadedNeighbouringBuildings(null);
    };
  }, []);

  useEffect(() => {
    if (geometry) {
      let message: MessageState = {
        text: "Updating surrounding buildings",
        variant: "info"
      };

      projectStoreActions.setMessageState(message);
    }

    mapSettingsActions.setLoadedNeighbouringBuildings(null);
  }, [worldCoordinates, selectedProject?.coordinates]);

  return !geometry ? null : (
    <mesh
      geometry={geometry}
      material={materialLibrary.meshPhongMaterial_NeighbouringBuildings}
      receiveShadow={shadowDisplay.receiveShadows}
      castShadow={shadowDisplay.receiveShadows}
      renderOrder={1}
      visible={mapSettings.displayMap && mapSettings.showNeighbouringBuildings}
    />
  );
});
