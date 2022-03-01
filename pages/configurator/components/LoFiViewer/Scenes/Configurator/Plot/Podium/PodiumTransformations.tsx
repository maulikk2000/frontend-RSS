import { Fragment, MutableRefObject, useEffect, useMemo, useRef } from "react";
import { Mesh, Vector3 } from "three";
import { createThreeJSObjectFromVectors, getCentreOfVectors, getEdgesFromVertices } from "../../../../../utils";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import { useConfiguratorToolsStore } from "pages/configurator/stores/configuratorToolsStore";
import { Plot } from "pages/configurator/data/v2/types";
import { PositionControlWidget } from "pages/configurator/components/LoFiViewer/Transformations/ControlWidgets/PositionControlWidget";
import {
  getAngleVerticesFromBoundary,
  movePoints,
  rotateMesh,
  updateBoundaryMesh,
  updateBoundaryVertices
} from "pages/configurator/utilities/transformationUtils";
import { DrawObject } from "pages/configurator/components/LoFiViewer/Transformations/Draw/DrawObject";
import { EdgeMeasurements } from "pages/configurator/components/LoFiViewer/Tools/EdgeMeasurements/EdgeMeasurements";
import { VerticeAngles } from "pages/configurator/components/LoFiViewer/Tools/VerticeAngles/VerticeAngles";
import cloneDeep from "lodash-es/cloneDeep";
import { ObjectLines } from "pages/configurator/components/LoFiViewer/Tools/ObjectLines/ObjectLines";
import shallow from "zustand/shallow";

type Props = {
  plot: Plot;
  podiumRef: MutableRefObject<Mesh | undefined>;
};

export const PodiumTransformations = ({ plot, podiumRef }: Props) => {
  const [, buildingServiceActions] = useV2BuildingServiceStore();

  const [configToolsMode, setConfigToolsMode] = useConfiguratorToolsStore(
    (state) => [state.mode, state.setMode],
    shallow
  );

  const lastSelectedVertex = useRef<number>();

  const onKeyPress = (event: KeyboardEvent) => {
    if (lastSelectedVertex.current !== undefined && (event.key === "Delete" || event.key === "Backspace")) {
      removeVertex(lastSelectedVertex.current);
      lastSelectedVertex.current = undefined;
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyPress, false);
    return () => {
      document.removeEventListener("keydown", onKeyPress, false);
    };
  }, []);

  const podiumHeight = plot.podium.floorCount * plot.podium.floorToFloorHeight;

  const podiumEdges = useRef(getEdgesFromVertices(plot.podium.boundary));
  const angleVertices = useRef<Vector3[]>(plot.podium.boundary);
  const vertices = useRef<Vector3[]>(plot.podium.boundary);
  const measurementsHeight = useRef<number>(0);

  const angleVisible = useRef<boolean>(false);

  const boundaryCentroids: Vector3[] = useMemo(() => {
    let centroids: Vector3[] = [];
    podiumEdges.current.forEach((edge, index) => {
      if (index === 0) {
        return;
      }
      centroids.push(getCentreOfVectors(edge));
    });

    return centroids;
  }, [podiumEdges.current]);

  const measurementsVisible = configToolsMode === "edit";

  useEffect(() => {
    podiumEdges.current = getEdgesFromVertices(plot.podium.boundary);
    vertices.current = plot.podium.boundary;
  }, [plot.podium.boundary]);

  const moveObject = (transformObject: Mesh, commit = false) => {
    const movedPodium = movePoints(transformObject.position, plot.podium.boundary);

    podiumEdges.current = getEdgesFromVertices(movedPodium);
    vertices.current = movedPodium;

    updateBoundaryMesh(podiumRef.current, movedPodium, podiumHeight);

    if (commit) {
      buildingServiceActions.setPodiumBoundary(movedPodium);
    }
  };

  const moveVertex = (transformObject: Mesh, commit = false, index: number, addVertex = false) => {
    let boundary = cloneDeep(plot.podium.boundary);

    if (addVertex) {
      boundary.splice(index + 1, 0, new Vector3().copy(transformObject.position));
    } else {
      boundary = updateBoundaryVertices(plot.podium.boundary, index, transformObject.position);
    }
    updateBoundaryMesh(podiumRef.current, boundary, podiumHeight);

    podiumEdges.current = getEdgesFromVertices(boundary);
    vertices.current = boundary;
    if (addVertex) {
      // gets angle of newly added vector
      angleVertices.current = [boundary[index], boundary[index + 1], boundary[index + 2]];
    } else {
      angleVertices.current = getAngleVerticesFromBoundary(boundary, index);
    }
    angleVisible.current = !commit;

    if (commit) {
      lastSelectedVertex.current = addVertex ? index + 1 : index;
      buildingServiceActions.setPodiumBoundary(boundary);
    }
  };

  const rotateObject = (object: Mesh, commit: boolean = false) => {
    const rotatedPodium = rotateMesh(object, plot.podium.boundary);
    updateBoundaryMesh(podiumRef.current, rotatedPodium, podiumHeight);

    podiumEdges.current = getEdgesFromVertices(rotatedPodium);
    vertices.current = rotatedPodium;

    if (commit) {
      buildingServiceActions.setPodiumBoundary(rotatedPodium);
    }
  };

  const modifyPodiumHeight = (object: Mesh, commit: boolean = false) => {
    let height: number;

    let positionZ = object.position.z + podiumHeight;

    const minFloorCount = 1;
    const maxFloorCount = 2;
    const minHeight = plot.podium.floorToFloorHeight * minFloorCount;
    const maxHeight = plot.podium.floorToFloorHeight * maxFloorCount;

    if (positionZ < minHeight) {
      height = minFloorCount * plot.podium.floorToFloorHeight;
    } else if (positionZ > maxHeight) {
      height = maxFloorCount * plot.podium.floorToFloorHeight;
    } else {
      height = positionZ;
    }

    let floorCount = Math.round(height / plot.podium.floorToFloorHeight);

    const pHeight = floorCount * plot.podium.floorToFloorHeight;

    podiumRef.current!.geometry = createThreeJSObjectFromVectors(plot.podium.boundary, pHeight)!;

    if (plot.podium.floorCount !== floorCount) {
      buildingServiceActions.setPodiumFloorCount(floorCount);
    }
  };

  const drawPodiumBoundary = (vertices: Vector3[], commit: boolean = false, cancel: boolean = false) => {
    if (!podiumRef.current) {
      return;
    }
    if (cancel || vertices.length === 0) {
      const geometry = createThreeJSObjectFromVectors(plot.podium.boundary, podiumHeight);
      if (geometry) {
        podiumRef.current.geometry = geometry;
      }

      return;
    }

    if (vertices && vertices.length > 2) {
      podiumRef.current.geometry = createThreeJSObjectFromVectors(vertices, podiumHeight)!;

      if (commit) {
        buildingServiceActions.setPodiumBoundary(vertices);
        setConfigToolsMode("edit");
      }
    }
  };

  const removeVertex = (index: number) => {
    if (plot.podium.boundary.length < 5) {
      window.alert("Cannot delete any more vertices");
      return;
    }
    const removeItem = window.confirm("Delete vertex?");

    if (!removeItem) {
      return;
    }
    let boundary = cloneDeep(plot.podium.boundary);
    if (index === boundary.length - 1) {
      boundary.pop();
      boundary[0] = boundary[boundary.length - 1];
    } else {
      boundary.splice(index, 1);
      boundary[boundary.length - 1] = boundary[0];
    }

    updateBoundaryMesh(podiumRef.current, boundary, podiumHeight);

    podiumEdges.current = getEdgesFromVertices(boundary);
    vertices.current = getAngleVerticesFromBoundary(boundary, index);

    buildingServiceActions.setPodiumBoundary(boundary);
  };

  return (
    <>
      {configToolsMode === "edit" && (
        <>
          {plot.podium.boundary.map((vertex, index) => (
            <Fragment key={"boundary" + index}>
              <PositionControlWidget
                position={vertex}
                mode={"translate"}
                callback={(transformObject, commit) => moveVertex(transformObject, commit, index)}
              />
              <PositionControlWidget
                position={getCentreOfVectors([vertex]).setZ(podiumHeight)}
                mode={"height"}
                callback={modifyPodiumHeight}
                local={false}
              />
            </Fragment>
          ))}

          {boundaryCentroids.map((vector, index) => (
            <PositionControlWidget
              key={"centroid" + index}
              position={vector}
              mode={"translate"}
              callback={(transformObject, commit) => moveVertex(transformObject, commit, index, true)}
            />
          ))}

          <PositionControlWidget
            position={getCentreOfVectors(plot.podium.boundary)}
            mode={"rotate"}
            callback={rotateObject}
            local={false}
          />
          <PositionControlWidget
            position={getCentreOfVectors(plot.podium.boundary)}
            mode={"translate"}
            callback={moveObject}
            local={false}
          />

          <ObjectLines vertices={vertices} />

          <VerticeAngles vertices={angleVertices} zPosition={measurementsHeight} visible={angleVisible} />
        </>
      )}

      {configToolsMode === "draw" && <DrawObject updateGeometryFunction={drawPodiumBoundary} planeHeight={1} />}

      <EdgeMeasurements edges={podiumEdges} zPosition={measurementsHeight} visible={measurementsVisible} />
    </>
  );
};
