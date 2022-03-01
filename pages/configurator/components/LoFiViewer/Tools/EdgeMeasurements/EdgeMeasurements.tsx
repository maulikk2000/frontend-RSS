import { useFrame, useThree } from "@react-three/fiber";
import { MutableRefObject, useRef } from "react";
import { useSelectedWorkspace } from "stores/workspaceStore";
import { Mesh, Vector3 } from "three";
import { defaultMeasurementUnit } from "utils/constants";
import { RapidUpdateGeometryText } from "../RapidUpdateGeometryText/RapidUpdateGeometryText";
import { updateEdgeMeasurement } from "../RapidUpdateGeometryText/rapidUpdateGeometryTextUtils";

type Props = {
  edges: MutableRefObject<Vector3[][]>;
  zPosition: MutableRefObject<number>;
  visible: boolean;
};
export const EdgeMeasurements = ({ edges, zPosition, visible }: Props) => {
  const { camera } = useThree();
  const measurementPositions = useRef<Mesh[]>([]);
  const measurementTexts = useRef<any[]>([]);
  const [selectedWorkspace] = useSelectedWorkspace();
  const measurementUnit = selectedWorkspace?.measurement || defaultMeasurementUnit;

  useFrame(() => {
    edges.current.forEach((edge, index) => {
      updateEdgeMeasurement(
        edge,
        zPosition.current,
        measurementPositions.current[index],
        measurementTexts.current[index],
        camera,
        visible,
        measurementUnit
      );
    });
  });

  return (
    <>
      {edges.current.map((edge, index) => (
        <RapidUpdateGeometryText
          key={index}
          positionRefs={measurementPositions}
          textRefs={measurementTexts}
          index={index}
        />
      ))}
    </>
  );
};
