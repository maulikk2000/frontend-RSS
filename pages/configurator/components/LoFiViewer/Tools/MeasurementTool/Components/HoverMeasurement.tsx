import { useState, MutableRefObject, useRef } from "react";
import { Mesh, SphereBufferGeometry, Vector3 } from "three";
import { useFrame, useThree } from "react-three-fiber";
import { SiteNoteLabel } from "./SiteNoteLabel";
import { materialLibrary } from "utils/materialLibrary";

type Props = {
  lineMeshRef: MutableRefObject<Mesh | undefined>;
  startPoint: Vector3;
  lineCentreMeshRef: MutableRefObject<Mesh | undefined>;
  distanceRef: MutableRefObject<HTMLDivElement>;
};

export const HoverMeasurement = ({ lineMeshRef, lineCentreMeshRef, distanceRef, startPoint }: Props) => {
  const [vertexGeometry] = useState<SphereBufferGeometry>(() => {
    const radius = 1;
    const widthSegments = 32;
    const heightSegments = 32;
    const sphereCursor = new SphereBufferGeometry(radius, widthSegments, heightSegments);
    return sphereCursor;
  });

  const vertexMeshRef = useRef<Mesh>();
  const { camera } = useThree();

  useFrame(() => {
    if (vertexMeshRef.current) {
      vertexMeshRef.current.scale.set(10 / camera.zoom, 10 / camera.zoom, 10 / camera.zoom);
    }
  });

  return (
    <>
      <mesh
        ref={vertexMeshRef}
        position={startPoint}
        geometry={vertexGeometry}
        material={materialLibrary.meshBasicMaterial_HoverMeasurementVertex}
      ></mesh>
      <mesh ref={lineCentreMeshRef}>
        <SiteNoteLabel clickThrough={true}>
          <div ref={distanceRef}></div>
        </SiteNoteLabel>
      </mesh>
      <mesh ref={lineMeshRef} material={materialLibrary.meshLineMaterial_HoverMeasurementLine} />
    </>
  );
};
