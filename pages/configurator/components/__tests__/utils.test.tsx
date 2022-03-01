import ZoneNoCoordinates from "../../data/test/zoneNoCoordinate.json";
import ZoneLastCoordinateMismatch from "../../data/test/zoneLastCoordinateMismatch.json";
import Zone from "../../data/test/zone.json";
import { getCoordinatesFromGeoJSON, getCartesiansFromVectors, getBearingBetweenVectors } from "../utils";
import { coordinate, cartesian } from "../../data/types";
import { Vector3 } from "three";

describe("Configurator Page Utilities - Get Coordinates from GeoJSON", () => {
  it("geoJSON should generate when geoJSON's first and last coordinate are equal", () => {
    const coordinates: coordinate[] | null = getCoordinatesFromGeoJSON(Zone);

    expect(coordinates).toBeTruthy();
  });

  it("coordinates should not generate when geoJSON contains null coordinates", () => {
    const coordinates: coordinate[] | null = getCoordinatesFromGeoJSON(ZoneNoCoordinates);

    expect(coordinates).toBeNull();
  });

  it("coordinates should generate when geoJSON's first and last coordinate do not match", () => {
    const coordinates: coordinate[] | null = getCoordinatesFromGeoJSON(ZoneLastCoordinateMismatch);

    expect(coordinates).toBeTruthy();
  });
});

describe("Configurator Page Utilities - Vector To Cartesian Conversion", () => {
  const vector1: Vector3 = new Vector3(40, 35.64, 0);
  const vector2: Vector3 = new Vector3(-60.414, 12.187, 0);
  const vector3: Vector3 = new Vector3(-221.414, 102.187, 0);
  const vector4: Vector3 = new Vector3(-15.414, 19.187, 0);
  const vector5: Vector3 = new Vector3(204.414, 22.44, 0);
  const vector6: Vector3 = new Vector3(4.414, 5.8, 0);
  const vector7: Vector3 = new Vector3(60.414, 12.187, 0);
  const vector8: Vector3 = new Vector3(-11.414, 18.187, 0);
  const vector9: Vector3 = new Vector3(-2.5, 12.5, 0);
  const vector10: Vector3 = new Vector3(-20.414, 102.5, 0);

  const vectors: Array<Vector3> = [
    vector1,
    vector2,
    vector3,
    vector4,
    vector5,
    vector6,
    vector7,
    vector8,
    vector9,
    vector10
  ];

  const emptyVectors: Array<Vector3> = [];

  it("Should return an array of two numbers for each point", () => {
    const result: Array<cartesian> | null = getCartesiansFromVectors(vectors);

    expect(result![0]).toHaveLength(2);
  });

  it("Should return the same amount of cartesians as vectors", () => {
    const result: Array<cartesian> | null = getCartesiansFromVectors(vectors);

    expect(result).toHaveLength(vectors.length);
  });

  it("Should return null if no vectors are passed into it", () => {
    const result: Array<cartesian> | null = getCartesiansFromVectors(emptyVectors);

    expect(result).toBeNull();
  });

  it("Should return cartesian if one vectors is passed into it", () => {
    const result: Array<cartesian> | null = getCartesiansFromVectors([vector1]);

    expect(result).toBeTruthy();
  });

  it("Should return cartesian if one vectors is passed into it", () => {
    const result: Array<cartesian> | null = getCartesiansFromVectors([vector1]);

    expect(result).toHaveLength(1);
  });
});

describe("GetBearingBetweenVectors - Gets Angle between Vectors", () => {
  const spineNull: Vector3[] = [];
  const spineOne: Vector3[] = [new Vector3(-226.3803729184517, -146.31385793996037, 0)];
  const spine180: Vector3[] = [
    new Vector3(-186.8620669335234, -15.422913660642195, 0),
    new Vector3(-226.3803729184517, -146.31385793996037, 0),
    new Vector3(-291.8624052229018, -363.20081268258417, 0)
  ];

  const spine110 = [
    new Vector3(190.99017590227538, 379.62738484676805, 0),
    new Vector3(-70.46017536758278, 365.4677399671189, 0),
    new Vector3(-112.95109754816175, 225.61364723296265, 0)
  ];

  it("Angle Should equal 180", () => {
    const angle = getBearingBetweenVectors(spine180);
    expect(angle).toEqual(180);
  });

  it("Angle Should equal 110", () => {
    const angle = getBearingBetweenVectors(spine110);
    expect(angle).toEqual(110);
  });

  it("Empty array should equal zero", () => {
    const angle = getBearingBetweenVectors(spineNull);
    expect(angle).toEqual(0);
  });

  it("One vector should equal zero", () => {
    const angle = getBearingBetweenVectors(spineOne);
    expect(angle).toEqual(0);
  });
});

jest.mock("three.meshline", () => {});
