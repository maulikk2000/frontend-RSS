import { coordinate, cartesian, radian, CubsPoint } from "../data/types";
import {
  degreesToRadians,
  polygon,
  radiansToDegrees,
  coordAll,
  lineString,
  booleanClockwise,
  centerOfMass
} from "@turf/turf";
import { Vector3, Vector2, Shape, ExtrudeBufferGeometry, ExtrudeGeometryOptions, BufferGeometry, Mesh } from "three";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { ShapeUtils } from "three/src/extras/ShapeUtils";
import Proj4 from "proj4";
import { isEqual, uniqWith } from "lodash-es";
import { MeshLine } from "three.meshline";

//Fused 2 functions into one, if you want the 3D centre of vectors (z coordinate important), then set is2D to false
export const getCentreOfVectors = (vectors: Vector3[], is2D: boolean = true) => {
  let x: number = 0;
  let y: number = 0;
  let z: number = 0;

  let uniqueVectors: Vector3[] = uniqWith(vectors, isEqual);

  uniqueVectors.forEach((point) => {
    x += point.x;
    y += point.y;
    z += point.z;
  });
  if (!is2D) {
    return new Vector3(x / uniqueVectors.length, y / uniqueVectors.length, z / uniqueVectors.length);
  } else {
    return new Vector3(x / uniqueVectors.length, y / uniqueVectors.length);
  }
};

export const isVectorsClockwise = (vectors: Vector3[]): boolean | null => {
  const coordinates: coordinate[] = [];

  vectors.forEach((vector) => {
    coordinates.push([vector.x, vector.y]);
  });

  if (coordinates[0] !== coordinates[coordinates.length - 1]) {
    coordinates.push(coordinates[0]);
  }

  if (coordinates && coordinates.length > 1) {
    const polylines = lineString(coordinates);

    return booleanClockwise(polylines);
  } else {
    return null;
  }
};

export const createTowerGeometry = (
  spine: Vector3[],
  width: number,
  floorHeight: number,
  floorCount: number
): BufferGeometry => {
  const vertices: Vector3[] | null = getVerticesFromSpine(spine, width);

  if (!vertices) {
    return new BufferGeometry();
  }

  const floorSeperationOffset = 1;

  const floor = createThreeJSObjectFromVectors(vertices, floorHeight - floorSeperationOffset);

  const floors: BufferGeometry[] = [];
  let floorGeom: BufferGeometry = new BufferGeometry();

  if (floor) {
    for (let i = 0; i < floorCount; i++) {
      const newFloor = floor.clone();
      newFloor.translate(0, 0, i * floorHeight);
      floors.push(newFloor);
    }

    floorGeom = BufferGeometryUtils.mergeBufferGeometries(floors);
  }

  return floorGeom;
};

export const updateTowerGeometry = (
  spine: Vector3[],
  width: number,
  towerMesh: Mesh | undefined,
  floorHeight: number,
  floorCount: number
) => {
  if (!towerMesh) {
    return;
  }
  const towerGeometry = createTowerGeometry(spine, width, floorHeight, floorCount);
  if (towerMesh && towerGeometry) {
    towerMesh.geometry.dispose();
    towerMesh.geometry = towerGeometry;
  }
};

export const updateDrawnLine = (vertices: Vector3[], lineRef: React.MutableRefObject<Mesh | undefined>) => {
  if (lineRef.current) {
    const meshLine = new MeshLine();
    meshLine.setPoints(vertices);

    lineRef.current.geometry.dispose();
    lineRef.current.geometry = meshLine;
  }
};

/*********************************************************************************/
/**************************** Real World Conversions *****************************/
/*********************************************************************************/

// Transform Coordinates to Cartesian
export const coordinateToCartesian = (
  coordinate: coordinate,
  location: coordinate,
  measurementUnit: string = "ft"
): cartesian => {
  let crs: string;

  // Custom Coordinate String
  if (measurementUnit === "ft") {
    crs = `+proj=tmerc +lat_0=${location[1]} +lon_0=${location[0]} +units=us-ft`;
  } else {
    crs = `+proj=tmerc +lat_0=${location[1]} +lon_0=${location[0]}`;
  }

  // Translation from Coordinate to Cartesian
  let wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

  return Proj4(wgs84, crs, coordinate);
};

// Transform Cartesian to Coordinates
export const cartesianToCoordinate = (
  cartesian: cartesian,
  location: coordinate,
  measurementUnit: "m" | "ft" = "ft"
) => {
  let crs: string;

  // Custom Coordinate String
  if (measurementUnit === "ft") {
    crs = `+proj=tmerc +lat_0=${location[1]} +lon_0=${location[0]} +units=us-ft`;
  } else {
    crs = `+proj=tmerc +lat_0=${location[1]} +lon_0=${location[0]}`;
  }

  // Translation from Coordinate to Cartesian
  let wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

  return Proj4(crs, wgs84, [cartesian[0], cartesian[1]]);
};

export const cartesianToVector = (coordinate: cartesian) => {
  return new Vector3(coordinate[0], coordinate[1], coordinate[2] ? coordinate[2] : 0);
};

/*********************************************************************************/
/***************************** Turf Function Wrappers ****************************/
/*********************************************************************************/
export const getCentroidFromCoordinates = (coordinates: coordinate[]): number[] | null => {
  if (coordinates.length === 0) {
    return null;
  }

  if (!isEqual(coordinates[0], coordinates[coordinates.length - 1])) {
    coordinates.push(coordinates[0]);
  }

  const clonedCoordinates = [...coordinates];

  const poly = polygon([clonedCoordinates]);

  const centre = centerOfMass(poly);
  return centre.geometry ? centre.geometry.coordinates : [0, 0];
};

export const getCoordinatesFromGeoJSON = (envelope): coordinate[] | null => {
  const coordinates = coordAll(envelope);
  if (coordinates && coordinates.length > 0) {
    return coordAll(envelope);
  } else {
    return null;
  }
};

/**
 * Polygonises a sequence of points into a sequence of solid line segments passing through
 * them. The line segments have constant width specified by 'width' parameter. Points
 * are returned in an anticlockwise winding order.
 */
export const getVerticesFromSpine = (spine: Vector3[], width: number): Vector3[] => {
  if (spine.length < 2) {
    return [];
  }

  const left: Vector3[] = [];
  const right: Vector3[] = [];

  const upDir = new Vector3(0, 0, 1);
  const zeroVector = new Vector3();

  for (let i = 0; i < spine.length; i++) {
    const prevSegmentNormal =
      i > 0
        ? spine[i]
            .clone()
            .sub(spine[i - 1])
            .cross(upDir)
            .normalize()
        : zeroVector;

    const nextSegmentNormal =
      i + 1 < spine.length ? spine[i + 1].clone().sub(spine[i]).cross(upDir).normalize() : zeroVector;

    const binormal = new Vector3().addVectors(prevSegmentNormal, nextSegmentNormal).normalize();

    const cosHalfA = binormal.dot(i > 0 ? prevSegmentNormal : nextSegmentNormal);
    const radius = width / 2 / cosHalfA;

    right.push(spine[i].clone().addScaledVector(binormal, radius));
    left.push(spine[i].clone().addScaledVector(binormal, -radius));
  }

  return [...right, ...left.reverse()];
};

export const getEdgesFromVertices = (vertices: Vector3[]): Vector3[][] => {
  const edges: Array<[Vector3, Vector3]> = [];
  vertices.forEach((point, index) => {
    if (index === 0) {
      edges.push([vertices[vertices.length - 1], point]);
    } else {
      edges.push([vertices[index - 1], point]);
    }
  });

  return edges;
};

/*********************************************************************************/
/********************************* Unit Conversions ******************************/
/*********************************************************************************/
export const metresToFeet = (metre: number) => {
  return metre * 3.2808;
};

export const feetToMetres = (metre: number) => {
  return metre / 3.2808;
};

/*********************************************************************************/
/********************************* ThreeJS Helpers *******************************/
/*********************************************************************************/
export const getAreaFromPoints = (spine: Vector3[]): number | undefined => {
  const vertices: Vector2[] = [];
  spine.forEach((point) => vertices.push(new Vector2(point.x, point.y)));

  let area = ShapeUtils.area(vertices);

  if (Math.sign(area) === 1) {
    return area;
  } else {
    return Math.abs(area);
  }
};

export const createThreeJSObjectFromVectors = (
  vertices: Array<Vector3 | Vector2>,
  height: number
): ExtrudeBufferGeometry | null => {
  const vertices2D: Vector2[] = [];
  vertices.forEach((point: Vector3 | Vector2) => vertices2D.push(new Vector2(point.x, point.y)));

  const shape: Shape = new Shape(vertices2D);

  const extrusionSettings: ExtrudeGeometryOptions = {
    depth: height,
    curveSegments: 0,
    bevelEnabled: false,
    bevelThickness: 60
  };

  const geometry = new ExtrudeBufferGeometry(shape, extrusionSettings);

  return geometry;
};

export const getCartesiansFromVectors = (vectors: Array<Vector3> | null | undefined): Array<cartesian> | null => {
  if (!vectors) {
    return null;
  }

  const cartesianArray: Array<cartesian> = [];

  vectors.forEach((vector) => {
    const cartesianCoordinate: cartesian = [vector.x, vector.y];
    cartesianArray.push(cartesianCoordinate);
  });

  if (cartesianArray && cartesianArray.length > 0) {
    return cartesianArray;
  } else {
    return null;
  }
};

export const createNewVector = (origin: Vector3, angle: number, distance: number, withZ: boolean = false): Vector3 => {
  const newX = Math.cos((angle * Math.PI) / 180) * distance + origin.x;
  const newY = Math.sin((angle * Math.PI) / 180) * distance + origin.y;

  const result = new Vector3(newX, newY, withZ ? origin.z : 0);

  return result;
};

export const createRightAngleVector = (points: Vector3[], targetPoint: Vector3): Vector3 | null => {
  let newPoint: Vector3 | null | undefined;

  const firstArmBearing = getBearingBetweenVectors([points[points.length - 2], points[points.length - 1]]);

  const hoverBearing = getBearingBetweenVectors([points[points.length - 1], targetPoint]);

  const distance = getDistanceBetweenVectors([points[points.length - 1], targetPoint]);

  let degree = 0;

  let offsetBearing = hoverBearing - firstArmBearing;
  if (offsetBearing <= -180) {
    degree = 90;
  } else if (offsetBearing >= 0 && offsetBearing < 180) {
    degree = 90;
  } else {
    degree = -90;
  }

  newPoint = createNewVector(points[points.length - 1], firstArmBearing + degree, distance!);

  return newPoint;
};

export const vector3ToNumber = (vector: Vector3): number[] => {
  return [vector.x, vector.y, vector.z];
};

export const vector3ToPoint = (vector: Vector3): CubsPoint => {
  const point: CubsPoint = {
    ptX: vector.x,
    ptY: vector.y,
    ptZ: 0
  };
  return point;
};

export const vector3ToVector2 = (vector: Vector3): Vector2 => {
  const vector2 = new Vector2(vector.x, vector.y);
  return vector2;
};

export const pointToVector3 = (point: CubsPoint): Vector3 => {
  const vector: Vector3 = new Vector3(point.ptX, point.ptY, 0);

  return vector;
};

export const vector3ToCoordinate = (vector: Vector3): coordinate => {
  const coordinate: cartesian = [vector.x, vector.y, 0];

  return coordinate;
};

export const coordinateToVector3 = (coord: coordinate): Vector3 => {
  const vector: Vector3 = new Vector3(coord[0], coord[1], coord[2] ? coord[2] : 0);

  return vector;
};

export const setArm1 = (spine: Vector3[], length: number): Vector3[] => {
  let newSpine: Vector3[] = [];
  let bearing: number;

  if (typeof length === "string") {
    length = parseFloat(length);
  }

  // length = length < BUILDING_MINLENGTH ? BUILDING_MINLENGTH : length;
  // length = length > BUILDING_MAXLENGTH ? BUILDING_MAXLENGTH : length;

  if (spine.length >= 2) {
    bearing = getBearingBetweenVectors([spine[0], spine[1]]);

    const newPoint = createNewVector(spine[0], bearing, length);
    newSpine = [spine[0], newPoint];

    if (spine.length === 3) {
      bearing = getBearingBetweenVectors([spine[1], spine[0]]);

      const newPoint = createNewVector(spine[1], bearing, length);

      newSpine = [newPoint, spine[1], spine[2]];
    }
  }
  return newSpine;
};

export const setArm2 = (spine: Vector3[], length: number): Vector3[] => {
  let newSpine: Vector3[] = [];

  if (typeof length === "string") {
    length = parseFloat(length);
  }

  if (!length) {
    while (spine.length > 2) {
      spine.pop();
    }
  }

  let bearing: number;
  // length = length < BUILDING_MINLENGTH ? BUILDING_MINLENGTH : length;
  // length = length > BUILDING_MAXLENGTH ? BUILDING_MAXLENGTH : length;

  if (spine.length >= 2) {
    if (spine.length > 2) {
      bearing = getBearingBetweenVectors([spine[1], spine[2]]);
    } else {
      bearing = getBearingBetweenVectors([spine[0], spine[1]]) + degreesToRadians(90);
    }

    const newPoint = createNewVector(spine[1], bearing, length);

    newSpine = [spine[0], spine[1], newPoint];
  }

  return newSpine;
};

export const getArm1FromSpine = (spine: Vector3[]) => {
  return getDistanceBetweenVectors([spine[0], spine[1]]);
};

export const getArm2FromSpine = (spine: Vector3[]) => {
  if (spine.length > 2) {
    return getDistanceBetweenVectors([spine[1], spine[2]]);
  } else {
    return 0;
  }
};

export const getArm3FromSpine = (spine: Vector3[]) => {
  if (spine.length > 3) {
    return getDistanceBetweenVectors([spine[2], spine[3]]);
  } else {
    return 0;
  }
};

export const getDistanceBetweenVectors = (vectors: Vector3[], is2D: boolean = true): number => {
  let newVectors: Vector3[] = [...vectors];
  if (is2D) {
    newVectors = newVectors.map((vec) => new Vector3(vec.x, vec.y, 0));
  }
  if (newVectors.length === 2) {
    return newVectors[0].distanceTo(newVectors[1]);
  } else {
    let distance = 0;
    if (newVectors.length > 2) {
      newVectors.forEach((vector, index) => {
        if (index !== newVectors.length - 1) {
          distance += vector.distanceTo(newVectors[index + 1]);
        }
      });
    }

    return distance;
  }
};

export const getBearingBetweenVectors = (points: Vector3[]): radian => {
  if (points.length === 2) {
    return (Math.atan2(points[1].y - points[0].y, points[1].x - points[0].x) * 180) / Math.PI;
  } else if (points.length > 2 && points[2]) {
    var AB = Math.sqrt(Math.pow(points[1].x - points[0].x, 2) + Math.pow(points[1].y - points[0].y, 2));
    var BC = Math.sqrt(Math.pow(points[1].x - points[2].x, 2) + Math.pow(points[1].y - points[2].y, 2));
    var AC = Math.sqrt(Math.pow(points[2].x - points[0].x, 2) + Math.pow(points[2].y - points[0].y, 2));
    const sqrts = BC * BC + AB * AB - AC * AC;
    const sqrtDivider = 2 * BC * AB;
    const algo = sqrts / sqrtDivider;
    const radian = Math.acos(algo);
    // checks if radian === 180, fixes NaN error from Math.acos function
    if (algo.toFixed(12) === "-1.000000000000") {
      return 180;
    } else {
      return radiansToDegrees(radian);
    }
  } else {
    return 0;
  }
};

/*********************************************************************************/
/*********************************** Utilities ***********************************/
/*********************************************************************************/

/**
 * Formula described here: https://wiki.openstreetmap.org/wiki/Zoom_levels
 * We offset by 2^9 instead of 2^8 because MapBox uses 512x512 tiles.
 */
export const metersPerPixel = (latitude: number, zoomLevel: number) => {
  const earthCircumference = 40075017;
  const latitudeRadians = latitude * (Math.PI / 180);
  return (earthCircumference * Math.cos(latitudeRadians)) / Math.pow(2, zoomLevel + 9);
};

export const feetPerPixel = (latitude: number, zoomLevel: number) => metresToFeet(metersPerPixel(latitude, zoomLevel));

export const indexOfMinimumInArray = (array) => {
  var lowestIndex = 0;
  for (var i = 1; i < array.length; i++) {
    if (array[i] < array[lowestIndex]) {
      lowestIndex = i;
    }
  }
  return lowestIndex;
};
