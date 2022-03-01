import { Fragment, useEffect, useMemo, useRef } from "react";
import { Mesh, Vector3 } from "three";
import { useConfiguratorToolsStore } from "pages/configurator/stores/configuratorToolsStore";
import { Podium, Tower } from "pages/configurator/data/v2/types";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import { PositionControlWidget } from "pages/configurator/components/LoFiViewer/Transformations/ControlWidgets/PositionControlWidget";
import {
  getNewSuccessfulArmVector,
  isCrankedAngleError,
  isTowerArmLengthError,
  movePoints,
  rotateMesh,
  updateSpineMesh
} from "pages/configurator/utilities/transformationUtils";
import {
  createTowerGeometry,
  getBearingBetweenVectors,
  getCentreOfVectors,
  getEdgesFromVertices,
  getVerticesFromSpine,
  updateTowerGeometry
} from "pages/configurator/components/utils";
import { degreesToRadians } from "@turf/turf";
import { DrawObject } from "pages/configurator/components/LoFiViewer/Transformations/Draw/DrawObject";
import { EdgeMeasurements } from "pages/configurator/components/LoFiViewer/Tools/EdgeMeasurements/EdgeMeasurements";
import { VerticeAngles } from "pages/configurator/components/LoFiViewer/Tools/VerticeAngles/VerticeAngles";
import { cloneDeep } from "lodash";
import { ObjectLines } from "pages/configurator/components/LoFiViewer/Tools/ObjectLines/ObjectLines";
import shallow from "zustand/shallow";

type Props = {
  tower: Tower;
  towerRef: React.MutableRefObject<Mesh | undefined>;
  podium: Podium;
};

export const TowerTransformations = ({ tower, towerRef, podium }: Props) => {
  const [, buildingServiceActions] = useV2BuildingServiceStore();

  const [configToolsMode, setConfigToolsMode] = useConfiguratorToolsStore(
    (state) => [state.mode, state.setMode],
    shallow
  );

  const podiumHeight = podium.floorCount * podium.floorToFloorHeight;
  const towerHeight = tower.floorCount * tower.floorToFloorHeight;

  let lastSuccessfulPoint = useRef<Vector3>();

  const towerEdges = useRef<Vector3[][]>(getEdgesFromVertices(getVerticesFromSpine(tower.spine, tower.width)!));
  const measurementsHeight = useRef<number>(podiumHeight + towerHeight);
  const angleVisible = useRef<boolean>(false);

  const vertices = useRef<Vector3[]>([...tower.spine].map((point) => point.setZ(measurementsHeight.current)));

  if (towerRef.current) {
    towerRef.current.visible = configToolsMode !== "add";
  }

  const measurementsVisible = configToolsMode === "edit";

  const updateEdgeObjects = (points: Vector3[]) => {
    const edges = getEdgesFromVertices(getVerticesFromSpine(points, tower.width)!);

    edges.map((edge) => edge.map((point) => point.setZ(podiumHeight + towerHeight)));

    towerEdges.current = edges;
    vertices.current = points;
    vertices.current.map((point) => point.setZ(measurementsHeight.current));
  };

  useEffect(() => {
    updateEdgeObjects(tower.spine);
  }, [tower.spine]);

  const rotateObject = (transformObject: Mesh, commit = false) => {
    const rotatedSpine = rotateMesh(transformObject, tower.spine);
    updateSpineMesh(towerRef.current, rotatedSpine, tower);
    updateEdgeObjects(rotatedSpine);

    if (commit) {
      buildingServiceActions.setSpine(rotatedSpine);
    }
  };

  const moveObject = (transformObject: Mesh, commit = false) => {
    const movedSpine = movePoints(transformObject.position, tower.spine);
    updateSpineMesh(towerRef.current, movedSpine, tower);
    updateEdgeObjects(movedSpine);

    if (commit) {
      buildingServiceActions.setSpine(movedSpine);
    }
  };

  const moveSpinePoint = (transformObject: Mesh, commit = false, index: number) => {
    const spinePoints = cloneDeep(tower.spine);
    spinePoints[index].copy(transformObject.position).setZ(0);

    if (tower.spine.length > 2) {
      let points = [...spinePoints];
      const isAngleError = isCrankedAngleError(points);
      const isArmLengthError = isTowerArmLengthError([points[1], points[index]]);

      if (!isAngleError) {
        lastSuccessfulPoint.current = spinePoints[index];
      }
      if ((isAngleError || isArmLengthError) && lastSuccessfulPoint.current) {
        let successfulPoint = getNewSuccessfulArmVector(points, index, lastSuccessfulPoint.current);
        spinePoints[index].copy(successfulPoint).setZ(0);
        transformObject.position.set(successfulPoint.x, successfulPoint.y, transformObject.position.z);
      }
    }

    updateSpineMesh(towerRef.current, spinePoints, tower);
    updateEdgeObjects(spinePoints);

    angleVisible.current = !commit;

    if (commit) {
      buildingServiceActions.setSpine(spinePoints);
    }
  };

  const modifyTowerHeight = (object: Mesh, commit: boolean = false) => {
    let height: number;

    let positionZ = object.position.z + tower.floorCount * tower.floorToFloorHeight + podiumHeight;

    const minFloorCount = 1;
    const maxFloorCount = 100;
    const minHeight = podiumHeight + tower.floorToFloorHeight * minFloorCount;
    const maxHeight = podiumHeight + tower.floorToFloorHeight * maxFloorCount;

    if (positionZ < minHeight) {
      height = minFloorCount * tower.floorToFloorHeight;
      positionZ = minHeight;
    } else if (positionZ > maxHeight) {
      height = maxFloorCount * tower.floorToFloorHeight;
      positionZ = maxHeight;
    } else {
      height = positionZ - podiumHeight;
    }

    let floorCount = Math.round(height / tower.floorToFloorHeight);

    updateTowerGeometry(tower.spine, tower.width, towerRef.current, tower.floorToFloorHeight, floorCount);

    measurementsHeight.current = tower.floorToFloorHeight * floorCount + podiumHeight;
    vertices.current.map((point) => point.setZ(measurementsHeight.current));

    if (commit) {
      buildingServiceActions.setStandardFloorCount(floorCount);
    }
  };

  const drawTower = (vertices: Vector3[], commit: boolean = false, cancel: boolean = false) => {
    if (!towerRef.current) {
      return;
    }
    if (cancel || vertices.length === 0) {
      updateSpineMesh(towerRef.current, tower.spine, tower);
      return;
    }

    const floorToFloorHeight = 2;
    const floorCount = 1;

    const spineGeometry = createTowerGeometry(vertices, tower.width, floorToFloorHeight, floorCount);

    towerRef.current.geometry.dispose();
    towerRef.current.geometry = spineGeometry;

    if (commit) {
      buildingServiceActions.setSpine(vertices);
      setConfigToolsMode("edit");
      vertices.map((point) => point.setZ(0));
    }
  };

  return (
    <>
      {configToolsMode === "edit" && (
        <>
          {tower.spine.map((point, index) => (
            <PositionControlWidget
              key={index}
              position={getCentreOfVectors([point]).setZ(podiumHeight + tower.floorToFloorHeight * tower.floorCount)}
              mode={"translate"}
              callback={(transformObject, commit) => moveSpinePoint(transformObject, commit, index)}
              direction={degreesToRadians(
                getBearingBetweenVectors([tower.spine[index - 1] ?? tower.spine[index + 1], tower.spine[index]])
              )}
              showXModifier={tower.spine.length === 2 || (tower.spine.length > 2 && index !== 1)}
            />
          ))}

          <PositionControlWidget
            position={getCentreOfVectors(tower.spine).setZ(podiumHeight)}
            mode={"rotate"}
            callback={rotateObject}
            local={false}
          />
          <PositionControlWidget
            position={getCentreOfVectors(tower.spine).setZ(podiumHeight)}
            mode={"translate"}
            callback={moveObject}
            local={false}
          />

          {tower.spine.map((point, index) => (
            <Fragment key={index}>
              <PositionControlWidget
                key={index}
                position={getCentreOfVectors([point]).setZ(podiumHeight + tower.floorToFloorHeight * tower.floorCount)}
                mode={"translate"}
                callback={(transformObject, commit) => moveSpinePoint(transformObject, commit, index)}
              />
              <PositionControlWidget
                position={getCentreOfVectors([point]).setZ(podiumHeight + tower.floorToFloorHeight * tower.floorCount)}
                mode={"height"}
                callback={modifyTowerHeight}
                local={false}
              />
            </Fragment>
          ))}

          <ObjectLines vertices={vertices} />

          <VerticeAngles vertices={vertices} zPosition={measurementsHeight} visible={angleVisible} />
        </>
      )}

      {configToolsMode === "draw" && (
        <DrawObject
          updateGeometryFunction={drawTower}
          planeHeight={podiumHeight}
          maxVertices={tower.spine.length}
          spineWidth={tower.width}
        />
      )}

      <EdgeMeasurements edges={towerEdges} zPosition={measurementsHeight} visible={measurementsVisible} />
    </>
  );
};
