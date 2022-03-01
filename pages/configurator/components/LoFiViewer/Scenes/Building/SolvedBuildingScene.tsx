import React, { useRef } from "react";
import { Vector3, Mesh } from "three";
import { useShadowDisplayStore } from "pages/configurator/stores/shadowDisplayStore";
import materialColors from "styling/materialColors.module.scss";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import { ApartmentObject } from "./ApartmentObject";
import { degreesToRadians } from "@turf/turf";
import { useControls } from "leva";
import { useIsManualEastWhismanData } from "pages/configurator/stores/buildingServiceStoreSelectors";
import { materialLibrary } from "utils/materialLibrary";

export const SolvedBuildingScene = React.memo(() => {
  const [buildingService, buildingServiceActions] = useV2BuildingServiceStore();
  const [shadowDisplay] = useShadowDisplayStore();
  const [isManualEastwhismanData] = useIsManualEastWhismanData();

  const apartmentRefs = useRef<Mesh[]>([]);

  useControls(
    "Apartment Colours",
    {
      G_MicroST: materialColors.G_MicroST,
      G_ST: materialColors.G_ST,
      G_Jr1Br: materialColors.G_Jr1Br,
      G_1Br: materialColors.G_1Br,
      G_2Br: materialColors.G_2Br,
      G_3Br: materialColors.G_3Br,
      VerticalTransportColour: materialColors.VerticalTransport
    },
    { collapsed: true }
  );

  if (!buildingService.objects || (buildingService.objects && buildingService.objects.length === 0)) {
    return null;
  }

  const getMaterial = (objectName: string) => {
    if (!objectName) {
      return materialLibrary.meshPhongMaterial_SolvedBuilding_Podium;
    }
    return (
      materialLibrary["meshPhongMaterial_SolvedBuilding_" + objectName] ??
      materialLibrary.meshPhongMaterial_SolvedBuilding_Podium
    );
  };

  const setSelectedPodium = (e, index: number) => {
    e.stopPropagation();
    buildingServiceActions.setSelectedObjectIndex("plot", null, index);
  };

  const getSitePosition = () => {
    // site needs to be positioned for manually solved buildings
    if (isManualEastwhismanData) {
      return new Vector3(-170, 103, 0);
    } else {
      return undefined;
    }
  };

  const getSiteRotation = () => {
    // site needs to be positioned for manually solved buildings
    if (isManualEastwhismanData) {
      return [0, 0, degreesToRadians(73.5)] as any;
    } else {
      return undefined;
    }
  };

  return (
    <group position={getSitePosition()} rotation={getSiteRotation()}>
      {buildingService.objects &&
        buildingService.objects.map((object, index) => (
          <React.Fragment key={index}>
            {object.userData.isLines ? (
              object.children.map((mesh, index) => (
                <lineSegments
                  key={index}
                  material={materialLibrary.lineBasicMaterial_SolvedBuildingLine}
                  geometry={mesh["geometry"]}
                  castShadow={false}
                  receiveShadow={false}
                />
              ))
            ) : object.userData.name === "Apartments" ? (
              <ApartmentObject
                object={object}
                receiveShadows={shadowDisplay.receiveShadows}
                visible={true}
                apartmentRefs={apartmentRefs}
              />
            ) : object.userData.name === "Podium" ? (
              object.children.map((mesh, index) => (
                <React.Fragment key={index}>
                  <mesh
                    geometry={mesh["geometry"]}
                    material={getMaterial(object.userData.name)}
                    onClick={(e) => setSelectedPodium(e, index)}
                    visible={true}
                    receiveShadow={shadowDisplay.receiveShadows}
                    castShadow={shadowDisplay.receiveShadows}
                  />
                </React.Fragment>
              ))
            ) : (
              object.children.map((mesh, index) => (
                <React.Fragment key={index}>
                  <mesh
                    geometry={mesh["geometry"]}
                    material={getMaterial(object.userData.name)}
                    visible={true}
                    receiveShadow={shadowDisplay.receiveShadows}
                    castShadow={shadowDisplay.receiveShadows}
                  />
                </React.Fragment>
              ))
            )}
          </React.Fragment>
        ))}
    </group>
  );
});
