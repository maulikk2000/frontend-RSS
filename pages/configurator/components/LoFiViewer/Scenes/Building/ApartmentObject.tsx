import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import { getNameFromGDVUnitType } from "pages/scenario/utils/apartmentUtils";
import React, { RefObject, useRef } from "react";
import { Mesh, MeshBasicMaterial, MeshPhongMaterial, Object3D } from "three";
import { materialLibrary } from "utils/materialLibrary";
import { Html } from "../../Common/HtmlMarkers/Html";
import { ClickableMesh } from "./ClickableMesh";

type Props = {
  object: Object3D;
  visible: boolean;
  receiveShadows: boolean;
  apartmentRefs: RefObject<Mesh[] | undefined>;
};

export const ApartmentObject = ({ object, visible, receiveShadows, apartmentRefs }: Props) => {
  const [, buildingServiceActions] = useV2BuildingServiceStore();
  const hoveredOutCountRef = useRef(1);
  const hoveredInCountRef = useRef(1);

  const hoverRef = useRef<Mesh>();
  const itemRef = useRef<any>();

  const handleApartmentClick = (e, mesh) => {
    e.stopPropagation();

    if (mesh.userData.apartment) {
      buildingServiceActions.setSelectedObjectIndex("tower", mesh.userData.towerIndex, mesh.userData.plotIndex);
    }
  };

  const onPixelMouse = (e, mesh, index, hoverOut: boolean = false) => {
    e.stopPropagation();

    if (apartmentRefs.current) {
      if (!hoverOut) {
        apartmentRefs.current[index].material = materialLibrary.meshPhongMaterial_SolvedBuilding_Selected;
      } else {
        apartmentRefs.current[index].material =
          materialLibrary["meshPhongMaterial_SolvedBuilding_" + mesh.userData.unitMixType] ??
          materialLibrary.meshPhongMaterial_SolvedBuilding_Extrusion;
      }
    }
    if (hoverRef.current && itemRef.current) {
      if (!hoverOut) {
        hoveredInCountRef.current += 1;
        itemRef.current.style.display = "block";
        hoverRef.current.position.copy(mesh.geometry.boundingBox.max);

        itemRef.current.innerText = getNameFromGDVUnitType(mesh.userData.apartment.unitMixType);

        itemRef.current.style.transform = `translate(-${itemRef.current.offsetWidth / 2}px, 30px)`;
      } else {
        hoveredOutCountRef.current += 1;
      }

      // This is super vital and super secret ref utilisation for threeJS
      // (aka I couldn't find another way to ensure hoverOut does not override hoverIn within 5 minutes)
      if (hoveredOutCountRef.current === hoveredInCountRef.current) {
        hoveredInCountRef.current = 0;
        hoveredOutCountRef.current = 0;
        itemRef.current.style.display = "none";
      }
    }
  };

  const getMaterial = (mesh: Object3D): MeshPhongMaterial | MeshBasicMaterial => {
    return (
      materialLibrary["meshPhongMaterial_SolvedBuilding_" + mesh.userData.unitMixType] ??
      materialLibrary.meshPhongMaterial_SolvedBuilding_Extrusion
    );
  };

  return (
    <>
      {object.children.map((mesh, index) => (
        <ClickableMesh
          key={index}
          mesh={mesh}
          receiveShadows={receiveShadows}
          castShadows={receiveShadows}
          isHidden={visible}
          meshRef={
            apartmentRefs && apartmentRefs.current
              ? (element) => {
                  apartmentRefs.current![index] = element;
                }
              : undefined
          }
          index={index}
          handleClick={handleApartmentClick}
          handleMouse={onPixelMouse}
          getMaterial={getMaterial}
          renderOrder={1}
        />
      ))}

      <mesh ref={hoverRef}>
        <Html style={{ pointerEvents: "none" }} scaleFactor={250}>
          <div
            style={{
              textAlign: "center",
              width: "auto",
              whiteSpace: "nowrap",
              borderRadius: "4px",
              padding: 5,
              display: "none",
              background: "rgb(35 180 195 / 0.5)"
            }}
            ref={itemRef}
          ></div>
        </Html>
      </mesh>
    </>
  );
};
