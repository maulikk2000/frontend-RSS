import { coordinateToCartesian, feetToMetres, getCoordinatesFromGeoJSON, metresToFeet } from "../components/utils";
import { coordinate } from "../data/types";
import osmtogeojson from "osmtogeojson";
import axios from "axios";
import { ExtrudeBufferGeometry, Vector2, Shape, ExtrudeGeometryOptions } from "three";
import { FeatureCollection } from "@turf/turf";

export const getOverpassData = async (
  lngLat: [number, number],
  radius: number, // in meters
  queryItem: string
) => {
  const json = `
  [out:json]
  [timeout:25];
  (
    node[${queryItem}](
      around: ${radius}, ${lngLat[1]}, ${lngLat[0]}
    );
    way[${queryItem}](
      around: ${radius}, ${lngLat[1]}, ${lngLat[0]}
    );
    relation[${queryItem}](
      around: ${radius}, ${lngLat[1]}, ${lngLat[0]}
    );
  );
  out body;
  >;
  out skel qt;
  `;

  const response = await axios.post("https://overpass-api.de/api/interpreter", json);

  // osmtogeojson and turf are using two different versions of geojson type specs.
  // it causes a bit of typescript weirdness, so I cast it to the turf version here.
  return osmtogeojson(response.data) as FeatureCollection;
};

export const createThreeJSObjectFromGeoJSONFeature = (
  feature: any,
  lngLat: [number, number],
  extrudeOptions: Omit<ExtrudeGeometryOptions, "depth">
): ExtrudeBufferGeometry => {
  const coords: coordinate[] = getCoordinatesFromGeoJSON(feature) ?? [];

  const points: Vector2[] = coords.map((c) => {
    const [x, y] = coordinateToCartesian(c, lngLat);
    return new Vector2(x, y);
  });

  const shape: Shape = new Shape(points);

  let height;

  const standardFloorHeightFt = 10;
  const standardFloorHeightM = feetToMetres(standardFloorHeightFt);

  if (feature.properties["building:height"]) {
    height = feature.properties["building:height"];
  } else if (feature.properties!["building:levels"]) {
    height = feature.properties!["building:levels"] * standardFloorHeightM;
  } else if (feature.properties.height) {
    height = feature.properties.height;
  } else {
    height = standardFloorHeightM;
  }

  height = metresToFeet(height);

  const extrusionSettings: ExtrudeGeometryOptions = {
    depth: height,
    ...extrudeOptions
  };

  const geometry = new ExtrudeBufferGeometry(shape, extrusionSettings);

  return geometry;
};
