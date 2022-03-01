import { useFrame, useThree } from "@react-three/fiber";
import { MutableRefObject, useRef } from "react";
import { Mesh, Vector3 } from "three";
import { RapidUpdateGeometryText } from "../RapidUpdateGeometryText/RapidUpdateGeometryText";
import { updateVerticeAngle } from "../RapidUpdateGeometryText/rapidUpdateGeometryTextUtils";

type Props = {
  vertices: MutableRefObject<Vector3[]>;
  zPosition: MutableRefObject<number>;
  visible: MutableRefObject<boolean>;
};
export const VerticeAngles = ({ vertices, zPosition, visible }: Props) => {
  const { camera } = useThree();

  const angleTexts = useRef<any[]>([]);
  const anglePositions = useRef<Mesh[]>([]);

  useFrame(() => {
    if (vertices.current.length > 2) {
      updateVerticeAngle(vertices.current, zPosition.current, anglePositions.current[0], angleTexts.current[0], camera);

      if (angleTexts.current[0]) {
        angleTexts.current[0].visible = visible.current;
        angleTexts.current[0].sync();
      }
    }
  });

  return <RapidUpdateGeometryText positionRefs={anglePositions} textRefs={angleTexts} index={0} />;
};
