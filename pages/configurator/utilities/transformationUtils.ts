import { degreesToRadians, distanceToRadians, radiansToDegrees } from "@turf/turf";
import { cloneDeep } from "lodash";
import {
  createNewVector,
  createThreeJSObjectFromVectors,
  createTowerGeometry,
  getBearingBetweenVectors,
  getCentreOfVectors,
  getDistanceBetweenVectors,
  isVectorsClockwise,
  pointToVector3
} from "pages/configurator/components/utils";
import { radian } from "pages/configurator/data/types";
import { Plot, Tower } from "pages/configurator/data/v2/types";
import { Mesh, Vector3, Quaternion, Raycaster, Camera } from "three";
import { CRANKEDANGLE_MIN, MINARMLENGTH } from "../data/constants";
import { SolvedTower } from "../data/v2/buildingDatav2";

export const getMouseVectorPosition = (
  domElement: HTMLCanvasElement,
  e: PointerEvent | MouseEvent,
  camera: Camera,
  raycaster: Raycaster,
  plane: Mesh
) => {
  let point: Vector3 | undefined;
  let rect = domElement.getBoundingClientRect();
  let currMouse = new Vector3(
    ((e.clientX - rect.left) / rect.width) * 2 - 1,
    (-(e.clientY - rect.top) / rect.height) * 2 + 1,
    0
  );
  raycaster.setFromCamera(currMouse, camera);
  if (raycaster && raycaster.layers) {
    const intersections = raycaster.intersectObjects([plane], true);
    if (intersections.length > 0) {
      point = intersections[0].point;
    }
  }

  return point;
};

export const updateSpineMesh = (spineMesh: Mesh | undefined, boundarySpine: Vector3[], tower: Tower) => {
  if (spineMesh) {
    const spineGeometry = createTowerGeometry(boundarySpine, tower.width, tower.floorToFloorHeight, tower.floorCount);
    spineMesh.geometry.dispose();
    spineMesh.geometry = spineGeometry;
  }
};

export const isCrankedAngleError = (points: Vector3[]) => {
  let vertices = [...points];
  if (isVectorsClockwise(vertices)) {
    vertices.reverse();
  }
  const bearing = getBearingBetweenVectors(vertices);

  const isAngleError = bearing < CRANKEDANGLE_MIN && vertices.length > 2;

  return isAngleError;
};

export const isTowerArmLengthError = (points: Vector3[]) => {
  let distance = getDistanceBetweenVectors(points);

  if (points.length !== 2) {
    distance = getDistanceBetweenVectors([points[points.length - 2], points[points.length - 1]]);
  }

  const isTowerArmLengthError = distance < MINARMLENGTH;

  return isTowerArmLengthError;
};

export const getNewSuccessfulArmVector = (points: Vector3[], index: number, lastSuccessfulPoint: Vector3) => {
  let successfulPoint = lastSuccessfulPoint;
  if (index === 0 || index === points.length - 1) {
    let previousIndex = index === 0 ? 1 : points.length - 2;
    let distanceLine = [points[previousIndex], points[index]];
    let bearingLine = [points[previousIndex], lastSuccessfulPoint];
    let bearing = getBearingBetweenVectors(bearingLine);
    let distance = getDistanceBetweenVectors(distanceLine);
    distance = distance < MINARMLENGTH ? MINARMLENGTH : distance;
    successfulPoint = createNewVector(points[1], bearing, distance);
  } else {
    //Allows scalablitiy for spines with more than 3 points
    let prevIndex = index - 1;
    let nextIndex = index + 1;
    //Use lastSuccessfulPoint instead of points[index] as we want to lock the moveable point on crankedAngleError.
    let prevDistanceLine = [points[prevIndex], lastSuccessfulPoint];
    let nextDistanceLine = [lastSuccessfulPoint, points[nextIndex]];
    let prevBearingLine = [points[prevIndex], lastSuccessfulPoint];
    let nextBearingLine = [points[nextIndex], lastSuccessfulPoint];
    let prevBearing = getBearingBetweenVectors(prevBearingLine);
    let nextBearing = getBearingBetweenVectors(nextBearingLine);
    let prevDistance = getDistanceBetweenVectors(prevDistanceLine);
    let nextDistance = getDistanceBetweenVectors(nextDistanceLine);
    prevDistance = prevDistance < MINARMLENGTH ? MINARMLENGTH : prevDistance;
    nextDistance = nextDistance < MINARMLENGTH ? MINARMLENGTH : nextDistance;
    successfulPoint = createNewVector(points[prevIndex], prevBearing, prevDistance);
    if (getDistanceBetweenVectors([successfulPoint, points[nextIndex]]) < MINARMLENGTH) {
      //Point too close to point[next]
      successfulPoint = createNewVector(points[nextIndex], nextBearing, nextDistance);
      if (getDistanceBetweenVectors([successfulPoint, points[prevIndex]]) < MINARMLENGTH) {
        //Point too close to point[next] and point[prev]
        //Calculates the intersection points of two circles with centres points[prev] and points[next] and radius MINARMLENGTH then snaps to the closest intersection point.
        const baseAngle = getBearingBetweenVectors([points[prevIndex], points[nextIndex]]);
        const adjacentLineLength = getDistanceBetweenVectors([points[prevIndex], points[nextIndex]]);
        let minViableAngle = Math.acos(adjacentLineLength / 2 / MINARMLENGTH);
        minViableAngle = radiansToDegrees(minViableAngle);
        const intersectPoint1 = createNewVector(points[prevIndex], baseAngle + minViableAngle, MINARMLENGTH);
        const intersectPoint2 = createNewVector(points[prevIndex], baseAngle - minViableAngle, MINARMLENGTH);
        const distance1 = getDistanceBetweenVectors([intersectPoint1, lastSuccessfulPoint]);
        const distance2 = getDistanceBetweenVectors([intersectPoint2, lastSuccessfulPoint]);
        successfulPoint = distance1 < distance2 ? intersectPoint1 : intersectPoint2;
      }
    }
  }
  return successfulPoint;
};

export const getTowerBoundaryLength = (tower: Tower, length: number) => {
  if (tower.spine.length === 2) {
    return length;
  } else {
    return length - tower.width / 2;
  }
};

export const updateBoundaryMesh = (boundaryMesh: Mesh | undefined, boundary: Vector3[], height) => {
  if (boundaryMesh) {
    const boundaryGeometry = createThreeJSObjectFromVectors(boundary, height)!;
    boundaryMesh.geometry.dispose();
    boundaryMesh.geometry = boundaryGeometry;
  }
};

export const rotateMesh = (object: Mesh, spine: Vector3[]) => {
  const radian = object.rotation.z;
  const pivot = getCentreOfVectors(spine);
  const rotation = radiansToDegrees(radian);
  const rotatedSpine = rotatePoints(spine, rotation, pivot);

  return rotatedSpine;
};

export const getIntersectVectorFromLines = (line1: Vector3[], line2: Vector3[]): Vector3 => {
  let result = new Vector3();
  // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
  let denominator, a, b, numerator1, numerator2;
  denominator =
    (line2[1].y - line2[0].y) * (line1[1].x - line1[0].x) - (line2[1].x - line2[0].x) * (line1[1].y - line1[0].y);
  if (denominator === 0) {
    return result;
  }
  a = line1[0].y - line2[0].y;
  b = line1[0].x - line2[0].x;
  numerator1 = (line2[1].x - line2[0].x) * a - (line2[1].y - line2[0].y) * b;
  numerator2 = (line1[1].x - line1[0].x) * a - (line1[1].y - line1[0].y) * b;
  a = numerator1 / denominator;
  b = numerator2 / denominator;

  // if we cast these lines infinitely in both directions, they intersect here:
  result.x = line1[0].x + a * (line1[1].x - line1[0].x);
  result.y = line1[0].y + a * (line1[1].y - line1[0].y);

  return result;
};

export const getIntersectionVectorFromProjection = (
  point1: Vector3,
  point2: Vector3,
  point3: Vector3,
  point4: Vector3
) => {
  if ((point1.x === point2.x && point1.y === point2.y) || (point3.x === point4.x && point3.y === point4.y)) {
    return false;
  }

  const denominator = (point4.y - point3.y) * (point2.x - point1.x) - (point4.x - point3.x) * (point2.y - point1.y);

  // Lines are parallel
  if (denominator === 0) {
    return false;
  }

  let ua =
    ((point4.x - point3.x) * (point1.y - point3.y) - (point4.y - point3.y) * (point1.x - point3.x)) / denominator;
  let ub =
    ((point2.x - point1.x) * (point1.y - point3.y) - (point2.y - point1.y) * (point1.x - point3.x)) / denominator;

  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return false;
  }

  // Return a vector with the x and y coordinates of the intersection
  let newVector: Vector3 = new Vector3(point1.x + ua * (point2.x - point1.x), point1.y + ua * (point2.y - point1.y), 0);

  return newVector;
};

export const movePoint = (point: Vector3, position: Vector3): Vector3 => {
  return new Vector3(point.x + position.x, point.y + position.y, 0);
};

export const movePoints = (position: Vector3, vectors: Vector3[]) => {
  let movedPoints: Vector3[];

  movedPoints = vectors.map((point) => {
    return movePoint(point, position);
  });

  return movedPoints;
};

export const offsetPoint = (point: Vector3, offset: Vector3): Vector3 => {
  return new Vector3(point.x - offset.x, point.y - offset.y, 0);
};

export const offsetPoints = (position: Vector3, vectors: Vector3[]) => {
  let offsetPoints: Vector3[];

  offsetPoints = vectors.map((point) => {
    return offsetPoint(point, position);
  });

  return offsetPoints;
};

export const applyTriceratopsQuaternion = (mesh: Mesh) => {
  const quaternion = new Quaternion(0, 0, 0);
  quaternion.setFromAxisAngle(new Vector3(0, 0, 1), degreesToRadians(180));
  mesh.rotation.x = degreesToRadians(90);
  mesh.applyQuaternion(quaternion);
};

const rotate = (point: Vector3, angle: radian): Vector3 => {
  return new Vector3(
    point.x * Math.cos(angle) - point.y * Math.sin(angle),
    point.x * Math.sin(angle) + point.y * Math.cos(angle),
    0
  );
};

export const rotatePoint = (point: Vector3, angle: number, pivot: Vector3): Vector3 => {
  const r = degreesToRadians(angle);

  if (!pivot || (pivot.x === 0 && pivot.y === 0)) {
    const rotatedItem = rotate(point, r);
    return new Vector3(rotatedItem.x, rotatedItem.y, 0);
  } else {
    const newPoint = new Vector3(point.x - pivot.x, point.y - pivot.y, 0);
    const rotated = rotate(newPoint, r);
    rotated.x = rotated.x + pivot.x;
    rotated.y = rotated.y + pivot.y;

    return rotated;
  }
};

export const rotatePoints = (points: Vector3[], angle: number, pivot: Vector3): Vector3[] => {
  const newBoundary: Vector3[] = [];
  points.forEach((point) => {
    newBoundary.push(rotatePoint(point, angle, pivot));
  });
  return newBoundary;
};

export const getLabelPosition = (plot: Plot) => {
  const highestFloor = Math.max.apply(
    Math,
    plot.towers.map((tower) => tower.floorCount * tower.floorToFloorHeight)
  );

  const distanceAboveTowers = 40;
  const height = highestFloor + plot.podium.floorToFloorHeight * plot.podium.floorCount + distanceAboveTowers;

  const podiumCentroid = getCentreOfVectors(plot.podium.boundary);

  return new Vector3(podiumCentroid.x, podiumCentroid.y, height);
};

export const getCentreOfTowerSpaces = (tower: Tower | SolvedTower) => {
  // check if solved tower or not
  let isSolvedTower = tower as SolvedTower;
  let spine;
  if (isSolvedTower.spaces) {
    spine = isSolvedTower.spine.map(pointToVector3);
  } else {
    spine = tower.spine;
  }
  let centre: Vector3;
  if (spine.length === 0) {
    centre = new Vector3(0, 0, 0);
  } else {
    centre = spine[1].clone();
  }

  if (spine.length % 2 === 0) {
    centre = getCentreOfVectors(spine);
  }

  const distanceAboveTowers = 40;
  centre.setZ(tower.floorCount * tower.floorToFloorHeight + distanceAboveTowers);

  return centre;
};

export const getAngleVerticesFromBoundary = (boundary: Vector3[], index: number) => {
  let angleVertices: Vector3[] = [];
  if (index === 0 || index === boundary.length - 1 || index === boundary.length) {
    angleVertices.push(boundary[boundary.length - 2]);
    angleVertices.push(boundary[0]);
    angleVertices.push(boundary[1]);
  } else {
    angleVertices = [boundary[index - 1], boundary[index], boundary[index + 1]];
  }
  if (isVectorsClockwise(angleVertices)) {
    angleVertices.reverse();
  }
  return angleVertices;
};

export const updateBoundaryVertices = (boundary: Vector3[], index: number, newVertex: Vector3) => {
  const modifiedBoundary = cloneDeep(boundary);
  if (index === 0 || index === modifiedBoundary.length - 1) {
    modifiedBoundary[0] = newVertex;
    modifiedBoundary[modifiedBoundary.length - 1] = newVertex;
  } else {
    modifiedBoundary[index] = newVertex;
  }

  return modifiedBoundary;
};
