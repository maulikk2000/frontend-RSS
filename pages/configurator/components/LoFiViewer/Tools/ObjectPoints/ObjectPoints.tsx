import { useRef } from "react";
import { Vector3, CircleBufferGeometry, Mesh } from "three";
import { ThreeEvent, useFrame, useThree } from "react-three-fiber";
import { scaleTextMeasurements } from "../RapidUpdateGeometryText/rapidUpdateGeometryTextUtils";
import { materialLibrary } from "utils/materialLibrary";

type Props = {
  points: Vector3[];

  /**
   * Callback is called on click of the object point
   * Passes Event back to the original function
   */
  callback?: (e: PointerEvent) => void;
};

export const ObjectPoints = ({ points, callback }: Props) => {
  const { camera } = useThree();
  const groupRefs = useRef<Mesh[]>([]);

  const innerCircleGeometry = useRef(new CircleBufferGeometry(8, 30, 30));
  const outerCircleGeometry = useRef(new CircleBufferGeometry(12, 30, 30));

  const hoverPoint = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    e.eventObject.scale.setScalar(1.5);
  };
  const hoverOutPoint = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    e.eventObject.scale.setScalar(1);
  };

  useFrame(() => {
    if (!groupRefs.current[0]) {
      return;
    }
    let scale = scaleTextMeasurements(groupRefs.current[0], camera);

    innerCircleGeometry.current = new CircleBufferGeometry(5 * scale, 30, 30);
    outerCircleGeometry.current = new CircleBufferGeometry(7.5 * scale, 30, 30);
  });

  return (
    <>
      {points.map((point, index) => (
        <group
          position={point}
          key={index}
          ref={(el: any) => (groupRefs.current[index] = el)}
          onPointerUp={points.length > 1 ? callback : undefined}
          onPointerOver={hoverPoint}
          onPointerOut={hoverOutPoint}
        >
          <mesh
            renderOrder={1}
            geometry={outerCircleGeometry.current}
            material={materialLibrary.lineBasicMaterial_ObjectPointsOuterCircle}
          />
          <mesh
            renderOrder={1}
            geometry={innerCircleGeometry.current}
            material={materialLibrary.meshBasicMaterial_ObjectPointsInnerCircle}
          />
        </group>
      ))}
    </>
  );
};
