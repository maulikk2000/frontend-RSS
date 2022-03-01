import { MutableRefObject } from "react";
import { Mesh } from "three";
import { useFrame, useThree } from "react-three-fiber";
import { flipRotationOnCameraMatrix } from "./rapidUpdateGeometryTextUtils";
import { useMeshReferenceStore } from "pages/configurator/stores/meshReferenceStore";
import { Text as Text3 } from "@react-three/drei";

type Props = {
  positionRefs: MutableRefObject<Mesh[]>;
  textRefs: MutableRefObject<any[]>;
  index: number;
};
export const RapidUpdateGeometryText = ({ positionRefs, textRefs, index }: Props) => {
  const { camera } = useThree();
  const [meshRefs] = useMeshReferenceStore();

  useFrame(() => {
    if (meshRefs.orbitRef && meshRefs.orbitRef.current.enabled)
      flipRotationOnCameraMatrix(positionRefs.current[index], camera);
  });

  return (
    <mesh ref={(el: Mesh) => (positionRefs.current[index] = el)}>
      <Text3
        ref={(el: any) => (textRefs.current[index] = el)}
        color={"white"}
        fontSize={10}
        lineHeight={1}
        textAlign={"left"}
        renderOrder={Infinity}
      >
        {""}
      </Text3>
    </mesh>
  );
};
