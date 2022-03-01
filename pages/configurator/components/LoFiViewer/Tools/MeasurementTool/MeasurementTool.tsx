import React, { useEffect, useRef, useState } from "react";
import { useSiteNoteStore } from "pages/configurator/stores/siteNoteStore";
import { useFrame, useThree } from "react-three-fiber";
import { useSelectedScenarios } from "stores/scenarioStore";
import { Mesh, Vector3, CircleGeometry, Raycaster, Vector2, Line3 } from "three";
import { MeshLine } from "three.meshline";
import {
  getCentreOfVectors,
  getDistanceBetweenVectors,
  getEdgesFromVertices,
  getVerticesFromSpine,
  indexOfMinimumInArray
} from "../../../utils";
import { toDecimalPlace } from "utils/strings";
import { useConfiguratorSettingsStore } from "pages/configurator/stores/configuratorSettingsStore";
import { SiteNote } from "./Components/SiteNote";
import { HoverMeasurement } from "./Components/HoverMeasurement";
import { useMousePosition } from "./Utils/useMousePosition";
import { useV2BuildingServiceStore } from "pages/configurator/stores/buildingServiceStoreV2";
import { ScenarioPhase } from "types/scenario";
import { SiteNoteObject } from "types/siteNote";
import { useSelectedWorkspace } from "stores/workspaceStore";
import { defaultMeasurementUnit } from "utils/constants";
import { measurementUnitDisplay } from "utils/units";
import { materialLibrary } from "utils/materialLibrary";

export const MeasurementTool = () => {
  const [siteNote, siteNoteActions] = useSiteNoteStore();
  const [configSettings] = useConfiguratorSettingsStore();
  const mouseEventRef: React.MutableRefObject<MouseEvent | undefined> = useMousePosition();
  const [buildingService] = useV2BuildingServiceStore();

  const mouseDownRef = useRef<MouseEvent>();
  const cursorMeshRef = useRef<Mesh>();
  const lineMeshRef = useRef<Mesh>();
  const lineCentreMeshRef = useRef<Mesh>();
  const distanceRef = useRef<any>();

  const [pointsBuffer, setPointsBuffer] = useState<Vector3[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isSnapMode, setIsSnapMode] = useState<boolean>(false);
  const [raycaster] = useState<Raycaster>(() => new Raycaster());

  const [selectedScenarios] = useSelectedScenarios();
  const [selectedWorkspace] = useSelectedWorkspace();
  const measurementUnit = selectedWorkspace?.measurement || defaultMeasurementUnit;

  const [hasRendered, setHasRendered] = useState<boolean>(false);
  const [buildingEdges, setBuildingEdges] = useState<Line3[]>([]);

  const [cursorGeometry] = useState<CircleGeometry>(() => {
    const radius = 1;
    const segments = 32;
    const geometry = new CircleGeometry(radius, segments);
    return geometry;
  });
  const [meshLine] = useState<MeshLine>(new MeshLine());

  const { camera, scene, gl } = useThree();

  useEffect(() => {
    if (selectedScenarios.length === 0) {
      return;
    }
    siteNoteActions.getAllSiteNotes(selectedScenarios[0].id);
  }, [selectedScenarios, siteNoteActions]);

  useEffect(() => {
    gl.domElement.addEventListener("pointerdown", onMouseDown, false);
    gl.domElement.addEventListener("pointerup", onClick, false);
    document.addEventListener("keydown", onKeyDown, false);
    document.addEventListener("keyup", onKeyUp, false);
    return () => {
      gl.domElement.removeEventListener("pointerdown", onMouseDown);
      gl.domElement.removeEventListener("pointerup", onClick);
      document.removeEventListener("keydown", onKeyDown);
      document.addEventListener("keyup", onKeyUp, false);
    };
  }, [gl.domElement, pointsBuffer, mouseDownRef.current]);

  useEffect(() => {
    gl.domElement.style.cursor = "crosshair";
  });

  useEffect(() => {
    if (buildingService.configuration) {
      let allLines: Line3[] = [];
      buildingService.configuration.plots.forEach((plot) => {
        plot.towers.forEach((tower) => {
          let vertices = getVerticesFromSpine(tower.spine, tower.width);
          if (vertices != null) {
            //There is always an extra vertex at the end that is a repeat of the first vertex.
            vertices.pop();
            let edges = getEdgesFromVertices(vertices).map((edge) => {
              return new Line3(edge[0], edge[1]);
            });
            allLines = allLines.concat(edges);
          }
        });
      });
      setBuildingEdges(allLines);
    }
  }, []);

  useFrame(() => {
    if (cursorMeshRef.current) {
      cursorMeshRef.current.scale.set(10 / camera.zoom, 10 / camera.zoom, 10 / camera.zoom);
    }
  });

  useFrame(() => {
    if (mouseEventRef && mouseEventRef.current) {
      if (!hasRendered) {
        setHasRendered(true);
      }
      let rect = gl.domElement.getBoundingClientRect();
      let currMouse = new Vector2(
        ((mouseEventRef.current.clientX - rect.left) / rect.width) * 2 - 1,
        (-(mouseEventRef.current.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(currMouse, camera);
      //Make sure all points are the same height so distance measurements are correct
      const uniformPointHeight = 1;
      if (raycaster && cursorMeshRef.current) {
        let hoveredPoint: Vector3 = new Vector3(
          mouseEventRef.current.clientX,
          mouseEventRef.current.clientY,
          uniformPointHeight
        );
        const intersections = raycaster.intersectObjects(scene.children, true);
        if (intersections.length > 0) {
          hoveredPoint = intersections[0].point;
        }
        //Disable snapping for solved buildings as it doesnt behave properly
        if (isSnapMode && selectedScenarios.length > 0 && selectedScenarios[0].phase !== ScenarioPhase.Solved) {
          hoveredPoint.z = uniformPointHeight;
          hoveredPoint = nearestSnappablePoint(hoveredPoint);
        }
        hoveredPoint.z = uniformPointHeight;
        cursorMeshRef.current.position.copy(hoveredPoint);
        if (mouseEventRef.current.clientX) {
          cursorMeshRef.current.visible = true;
        } else {
          cursorMeshRef.current.visible = false;
        }
        if (pointsBuffer.length > 0) {
          const endPoints = [pointsBuffer[pointsBuffer.length - 1], hoveredPoint];
          meshLine.setPoints([...pointsBuffer].concat(hoveredPoint));
          if (lineMeshRef.current) {
            lineMeshRef.current.geometry = meshLine;
          }
          if (distanceRef.current) {
            const distance = toDecimalPlace(getDistanceBetweenVectors(endPoints, configSettings.is2D), 2);
            distanceRef.current.innerText = `${distance} ${measurementUnitDisplay[measurementUnit.lengthUnit]}`;
          }
          const centre = getCentreOfVectors(endPoints);
          if (lineCentreMeshRef.current) {
            lineCentreMeshRef.current.position.copy(centre);
          }
        }
      }
    }
  });

  const onClick = (e: MouseEvent) => {
    //Helps differentiate between clicking and dragging so onClick doesn't fire when user drags
    if (mouseDownRef.current) {
      if (
        Math.abs(e.clientX - mouseDownRef.current.clientX) < 10 &&
        Math.abs(e.clientY - mouseDownRef.current.clientY) < 10
      ) {
        if (cursorMeshRef.current) {
          const position = cursorMeshRef.current.position.clone();
          const updatedBuffer = [...pointsBuffer].concat(position);
          setPointsBuffer(updatedBuffer);
          if (isDrawing && selectedScenarios.length > 0) {
            const point: SiteNoteObject = { label: "", points: updatedBuffer };
            siteNoteActions.addSiteNote(point, selectedScenarios[0]);
            setPointsBuffer([]);
          }
        }
        setIsDrawing(!isDrawing);
      }
    }
  };

  const nearestSnappablePoint = (hoveredPoint: Vector3) => {
    //Need a throwaway vector to as a 3rd prop for the closestPointToPoint function
    var returnVector = new Vector3(0, 0, 0);
    let distances = buildingEdges.map((edge) => {
      return edge.closestPointToPoint(hoveredPoint, true, returnVector).distanceTo(hoveredPoint);
    });
    let minIndex = indexOfMinimumInArray(distances);
    const snapDistance = 10;
    if (distances[minIndex] < snapDistance) {
      let closestPoint: Vector3 = new Vector3(0, 0, 0);
      return buildingEdges[minIndex].closestPointToPoint(hoveredPoint, true, closestPoint);
    } else {
      return hoveredPoint;
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Backspace") {
      setPointsBuffer([]);
      setIsDrawing(false);
    }
    if (e.key === "Shift") {
      setIsSnapMode(true);
    }
  };

  const onKeyUp = (e: KeyboardEvent) => {
    if (e.key === "Shift") {
      setIsSnapMode(false);
    }
  };
  const onMouseDown = (e: MouseEvent) => {
    mouseDownRef.current = e;
  };

  const deleteSiteNote = (siteNote: SiteNoteObject) => {
    if (selectedScenarios.length > 0) {
      siteNoteActions.removeSiteNote(siteNote, selectedScenarios[0]);
      setPointsBuffer([]);
    }
    setIsDrawing(false);
  };

  return (
    <>
      {hasRendered ? (
        <mesh
          material={materialLibrary.meshBasicMaterial_MeasurementToolCursor}
          geometry={cursorGeometry}
          ref={cursorMeshRef}
          name={"cursorMeshObject"}
        />
      ) : (
        <></>
      )}

      {siteNote.siteNotes.map((siteNote, index) => (
        <React.Fragment key={index}>
          <SiteNote siteNote={siteNote} isDrawing={isDrawing} deleteSiteNote={deleteSiteNote} />
        </React.Fragment>
      ))}
      {isDrawing ? (
        <HoverMeasurement
          startPoint={pointsBuffer[0]}
          lineMeshRef={lineMeshRef}
          lineCentreMeshRef={lineCentreMeshRef}
          distanceRef={distanceRef}
        />
      ) : (
        <></>
      )}
    </>
  );
};
