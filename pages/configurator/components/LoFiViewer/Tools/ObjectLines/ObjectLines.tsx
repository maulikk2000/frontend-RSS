import { MutableRefObject, useRef } from "react";
import { Vector3, Mesh, Vector2 } from "three";
import { MeshLine } from "three.meshline";
import { useFrame, useThree } from "react-three-fiber";
import { scaleTextMeasurements } from "../RapidUpdateGeometryText/rapidUpdateGeometryTextUtils";
import { MeshLineMaterial } from "three.meshline";
import materialColors from "styling/materialColors.module.scss";

type Props = {
  vertices: MutableRefObject<Vector3[]>;
};

export const ObjectLines = ({ vertices }: Props) => {
  const objectLineRef = useRef<Mesh>(null!);
  const { camera, size } = useThree();

  var resolution = new Vector2(size.width, size.height);

  const lineGeometry = useRef(new MeshLine());

  useFrame(() => {
    if (!objectLineRef.current) {
      return;
    }

    lineGeometry.current.setPoints(vertices.current);

    let scale = scaleTextMeasurements(objectLineRef.current, camera);
    objectLineRef.current.material = new MeshLineMaterial({
      useMap: false,
      resolution: resolution,
      lineWidth: 4 * scale,
      color: materialColors.PodiumDarkTeal,
      depthTest: false
    });
  });

  return <mesh renderOrder={0} ref={objectLineRef} geometry={lineGeometry.current} />;
};
