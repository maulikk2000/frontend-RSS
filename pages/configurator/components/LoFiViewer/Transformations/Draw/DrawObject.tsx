import { useEffect, useRef, useState } from "react";
import { Vector3, Mesh, Raycaster } from "three";
import {
  createRightAngleVector,
  getBearingBetweenVectors,
  getEdgesFromVertices,
  getVerticesFromSpine
} from "pages/configurator/components/utils";
import { DrawPlane } from "./DrawPlane";
import { useFrame, useThree } from "react-three-fiber";
import {
  getMouseVectorPosition,
  getNewSuccessfulArmVector,
  isCrankedAngleError,
  isTowerArmLengthError
} from "pages/configurator/utilities/transformationUtils";
import { VerticeAngles } from "../../Tools/VerticeAngles/VerticeAngles";
import { updateEdgeMeasurement } from "../../Tools/RapidUpdateGeometryText/rapidUpdateGeometryTextUtils";
import { RapidUpdateGeometryText } from "../../Tools/RapidUpdateGeometryText/RapidUpdateGeometryText";
import { ObjectLines } from "../../Tools/ObjectLines/ObjectLines";
import { ObjectPoints } from "../../Tools/ObjectPoints/ObjectPoints";
import { useSelectedWorkspace } from "stores/workspaceStore";
import { defaultMeasurementUnit } from "utils/constants";
import { useConfiguratorToolsStore } from "pages/configurator/stores/configuratorToolsStore";

type Props = {
  updateGeometryFunction: (vertices: Vector3[], commit?: boolean, cancel?: boolean) => void;

  planeHeight: number;

  maxVertices?: number;

  /** Signifies the object is generated from a spine
   * Allows creation of the measurements via this width
   *
   * Unset if not a spine object
   */
  spineWidth?: number;
};

export const DrawObject = ({ updateGeometryFunction, planeHeight, maxVertices, spineWidth }: Props) => {
  const { gl, camera } = useThree();

  const points = useRef<Vector3[]>([]);
  const vertices = useRef<Vector3[]>([]);
  const [objectPoints, setObjectPoints] = useState<Vector3[]>([]);
  const hoveredPoint = useRef<Vector3 | null>();
  const lastSuccessfulPoint = useRef<Vector3>();

  const addObjectType = useConfiguratorToolsStore((state) => state.addObjectType);

  const [edges, setEdges] = useState<Vector3[][]>([[new Vector3(), new Vector3()]]);

  const commit = useRef<boolean>();

  const planeRef = useRef<Mesh>();
  const pointerDownRef = useRef<MouseEvent>();
  const measurementsHeight = useRef<number>(planeHeight);

  const measurementTexts = useRef<any[]>([]);
  const measurementPositions = useRef<Mesh[]>([]);

  const angleVertices = useRef<Vector3[]>([new Vector3(), new Vector3()]);
  const angleVisible = useRef<boolean>(false);

  const [raycaster] = useState(new Raycaster());
  const [selectedWorkspace] = useSelectedWorkspace();
  const measurementUnit = selectedWorkspace?.measurement || defaultMeasurementUnit;

  useEffect(() => {
    gl.domElement.style.cursor = "crosshair";
  });

  useEffect(() => {
    document.addEventListener("pointerup", onClick, false);
    gl.domElement.addEventListener("pointerdown", onMouseDown, false);
    gl.domElement.addEventListener("pointermove", onHover, false);
    gl.domElement.addEventListener("pointerleave", onLeave, false);

    return () => {
      document.removeEventListener("pointerup", onClick);
      gl.domElement.removeEventListener("pointerdown", onMouseDown);
      gl.domElement.removeEventListener("pointermove", onHover);
      gl.domElement.removeEventListener("pointerleave", onLeave);
      gl.domElement.style.cursor = "unset";

      if (!commit.current && points.current.length > 0 && hoveredPoint.current) {
        updateGeometryFunction([], true, true);
      }
    };
  }, []);

  const onMouseDown = (e: MouseEvent) => {
    pointerDownRef.current = e;
  };

  const onHover = (e: PointerEvent) => {
    if (points.current.length === 0) {
      return;
    }

    if (commit.current && points.current.length > 1) {
      updateGeometryFunction([...points.current]);
      return;
    }
    if (!planeRef.current) {
      return;
    }
    let point = getMouseVectorPosition(gl.domElement, e, camera, raycaster, planeRef.current);

    if (!point) {
      return;
    }

    angleVisible.current = true;
    if (maxVertices) {
      let vertices = [...points.current, point];
      const isAngleError = isCrankedAngleError(vertices);
      const isArmLengthError = isTowerArmLengthError(vertices);

      if (maxVertices > 2 && !isAngleError) {
        lastSuccessfulPoint.current = point;
      }

      if ((isAngleError || isArmLengthError) && vertices.length > 2) {
        if (lastSuccessfulPoint.current) {
          let drawnIndex = 2;
          let successfulPoint = getNewSuccessfulArmVector(vertices, drawnIndex, lastSuccessfulPoint.current);
          vertices[drawnIndex].copy(successfulPoint).setZ(0);
          point = successfulPoint;
        }
        // lineRef.current!.material = lineMaterialError;
      } else {
        // lineRef.current!.material = lineMaterial;
      }
    }

    if (addObjectType === "gRPC") {
      const prevPoint = points.current[points.current.length - 1];
      const distance = point.distanceTo(prevPoint);

      const minDistance = 20;
      if (distance < minDistance) {
        point = prevPoint;
        hoveredPoint.current = prevPoint;
        return;
      }
    }

    if (points.current.length > 1) {
      let lastVertices = [points.current[points.current.length - 2], points.current[points.current.length - 1], point];

      const bearing = getBearingBetweenVectors(lastVertices);
      const rightAngleSnap = 3;

      // allows the user to snap to 90degree within 3 degrees of 90
      if (bearing > 90 - rightAngleSnap && bearing < 90 + rightAngleSnap && !e.shiftKey) {
        point = createRightAngleVector(points.current, point)!;
        hoveredPoint.current = point;
      } else {
        hoveredPoint.current = point;
      }

      // recalculate the degrees from right angle
      lastVertices = [points.current[points.current.length - 2], points.current[points.current.length - 1], point];
      angleVertices.current = lastVertices;
    } else {
      hoveredPoint.current = point;
    }

    vertices.current = [...points.current, point];
    vertices.current.map((point) => point.setZ(planeHeight));
    updateGeometryFunction(vertices.current);

    if (spineWidth) {
      const edges = getEdgesFromVertices(getVerticesFromSpine(vertices.current, spineWidth)!);
      edges.map((edge) => edge.map((i) => i.setZ(planeHeight)));
      setEdges(edges);
    } else {
      const edges = getEdgesFromVertices(vertices.current);
      edges.map((edge) => edge.map((i) => i.setZ(planeHeight)));
      setEdges(edges);
    }

    if (!spineWidth && points.current.length > 2) {
      vertices.current = [...vertices.current, vertices.current[0]];
    }
  };

  const onClick = (e: PointerEvent | MouseEvent) => {
    e.stopPropagation();

    const rightButtonClicked = e.button === 2;
    const mouseDeviation = 5;

    if (
      rightButtonClicked ||
      (points.current && maxVertices && maxVertices <= points.current.length) ||
      (pointerDownRef.current &&
        Math.abs(e.clientX - pointerDownRef.current.clientX) > mouseDeviation &&
        Math.abs(e.clientY - pointerDownRef.current.clientY) > mouseDeviation)
    ) {
      return;
    }

    if (!planeRef.current) {
      return;
    }
    let point = getMouseVectorPosition(gl.domElement, e, camera, raycaster, planeRef.current);

    if (!point) {
      return;
    }

    if (!hoveredPoint.current) {
      points.current = [point];
      setObjectPoints([point].map((point) => point.setZ(planeHeight)));
      return;
    }

    let currentVertices = [...points.current];
    !commit.current && currentVertices.push(hoveredPoint.current);

    points.current = currentVertices;
    setObjectPoints(currentVertices.map((point) => point.setZ(planeHeight)));

    if (addObjectType === "gRPC") {
      useConfiguratorToolsStore.setState({ drawnVertices: points.current });
    }

    const maxVerticesCommit = maxVertices === currentVertices.length;
    updateGeometryFunction([...currentVertices], maxVerticesCommit || commit.current);

    angleVisible.current = false;
  };

  const onLeave = () => {
    if (points.current.length > 1) {
      updateGeometryFunction(points.current);
    }
  };

  const finishShape = (e: PointerEvent) => {
    e.stopPropagation();
    commit.current = true;
  };

  useFrame(() => {
    edges.forEach((edge, index) => {
      if (points.current.length === 1 && index === 0) {
        return;
      }
      updateEdgeMeasurement(
        edge,
        planeHeight,
        measurementPositions.current[index],
        measurementTexts.current[index],
        camera,
        true,
        measurementUnit
      );
    });
  });

  return (
    <>
      {edges &&
        edges.map((edge, index) => (
          <RapidUpdateGeometryText
            key={index}
            positionRefs={measurementPositions}
            textRefs={measurementTexts}
            index={index}
          />
        ))}

      <VerticeAngles vertices={angleVertices} zPosition={measurementsHeight} visible={angleVisible} />

      <DrawPlane refObject={planeRef} />

      {hoveredPoint.current && <ObjectLines vertices={vertices} />}

      <ObjectPoints points={objectPoints} callback={finishShape} />
    </>
  );
};
