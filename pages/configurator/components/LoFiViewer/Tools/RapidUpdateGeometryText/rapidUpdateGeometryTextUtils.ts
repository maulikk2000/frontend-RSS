import { degreesToRadians } from "@turf/turf";
import {
  createNewVector,
  getBearingBetweenVectors,
  getCentreOfVectors,
  getDistanceBetweenVectors,
  isVectorsClockwise
} from "pages/configurator/components/utils";
import { toDecimalPlace } from "utils/strings";
import { Camera, Mesh, Object3D, OrthographicCamera, PerspectiveCamera, Vector3 } from "three";
import { Measurement } from "types/workspace";
import { measurementUnitDisplay } from "utils/units";

const radiusExtension = 2 * 1.3;
const fontSize = 10;
const smallFontSize = 8;
const maxFontSize = 13;
const offsetYDistance = 15;

export const updateEdgeMeasurement = (
  edge: [Vector3, Vector3] | Vector3[],
  zPosition: number,
  positionMesh: Mesh,
  textElement: any,
  camera: Camera,
  visible: boolean,
  measurementUnit: Measurement
) => {
  const distance = getDistanceBetweenVectors(edge);
  if (!distance) {
    return;
  }
  const centroid = getCentreOfVectors(edge).setZ(zPosition);
  const bearing = getBearingBetweenVectors(edge);

  if (positionMesh) {
    positionMesh.position.copy(createNewVector(centroid, bearing + 90, 8, true));
    const rotation = degreesToRadians(bearing);
    positionMesh.setRotationFromAxisAngle(new Vector3(0, 0, 1), rotation);
    positionMesh.updateMatrixWorld();
    flipRotationOnCameraMatrix(positionMesh, camera);
  }

  if (textElement) {
    textElement.visible = true;

    let scale = scaleTextMeasurements(textElement, camera);
    textElement.fontSize = scale * fontSize > maxFontSize ? maxFontSize : scale * fontSize;
    textElement.sync();

    const textRadius = textElement.geometry.boundingSphere.radius;
    textElement.visible = visible && textRadius * radiusExtension < distance;

    textElement.text = `${toDecimalPlace(distance, 2)} ${measurementUnitDisplay[measurementUnit.lengthUnit]}`;
    textElement.material.depthTest = false;
    textElement.sync();
  }
};

export const updateVerticeAngle = (
  points: [Vector3, Vector3, Vector3] | Vector3[],
  zPosition: number,
  positionMesh: Mesh,
  textElement: any,
  camera: Camera
) => {
  const vertices = [...points];
  if (isVectorsClockwise(vertices)) {
    vertices.reverse();
  }

  const position = new Vector3().copy(vertices[1]).setZ(zPosition);
  const bearing = Math.round(getBearingBetweenVectors(vertices));
  const worldBearing = getBearingBetweenVectors([vertices[vertices.length - 2], vertices[vertices.length - 1]]);
  const bearingPosition = Math.round(worldBearing + bearing / 2);

  if (positionMesh) {
    positionMesh.position.copy(createNewVector(position, bearingPosition, offsetYDistance, true));
    const rotation = degreesToRadians(bearingPosition + 90);
    positionMesh.setRotationFromAxisAngle(new Vector3(0, 0, 1), rotation);
    positionMesh.updateMatrixWorld();
    flipRotationOnCameraMatrix(positionMesh, camera);
  }

  if (textElement) {
    textElement.visible = true;

    let scale = scaleTextMeasurements(textElement, camera);
    textElement.fontSize = scale * smallFontSize > maxFontSize ? maxFontSize : scale * smallFontSize;
    textElement.text = `${bearing} °`;
    textElement.material.depthTest = false;
    textElement.sync();
  }
};

const eye = new Vector3();
const yAxis = new Vector3(0, 1, 0);

export const flipRotationOnCameraMatrix = (positionMesh: Mesh, camera: Camera) => {
  const AXIS_FLIP_TRESHOLD = 0.0;

  eye.set(0, 0, 0);
  yAxis.set(0, 1, 0);

  if (positionMesh) {
    camera.getWorldDirection(eye);
    const axisPosition = yAxis.applyQuaternion(positionMesh.quaternion).dot(eye);

    if (axisPosition < AXIS_FLIP_TRESHOLD) {
      positionMesh.rotateZ(Math.PI);
    }
  }
};

export const scaleTextMeasurements = (object: Object3D, camera: Camera) => {
  let factor;

  if (camera instanceof OrthographicCamera) {
    factor = (camera.top - camera.bottom) / camera.zoom;
  } else if (camera instanceof PerspectiveCamera) {
    factor =
      object.position.distanceTo(camera.position) *
      Math.min((1.9 * Math.tan((Math.PI * camera.fov) / 360)) / camera.zoom, 7);
  }

  let size = 0.01;
  return (factor * size) / 7;
};
