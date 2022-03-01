import { getCoord, points, center } from "@turf/turf";
import { getCentroidFromCoordinates } from "pages/configurator/components/utils";
import { CreateProjectRequest, Project } from "types/project";

export const createGeoJSONFromCoordinates = (coordinates: number[][], layerId: string) => {
  let feature: GeoJSON.Feature = {
    type: "Feature",
    properties: {
      layerId
    },
    geometry: {
      type: "Polygon",
      coordinates: [coordinates]
    }
  };
  let featcol: GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties> = {
    type: "FeatureCollection",
    features: [feature]
  };
  return featcol;
};

export const createProjectFromGeoJSONFeature = (json, selectedWorkspace: string, leadingProjectName: string) => {
  if (json.geometry.type !== "Polygon" || json.geometry.coordinates[0].length < 4) {
    return;
  }
  const project: CreateProjectRequest = {
    name: leadingProjectName + " " + json.properties.PARCEL_NAME,
    address: "",
    city: "Mountain View",
    state: "California",
    authority: "",
    zoningDistrict: selectedWorkspace,
    zoningLandUse: "",
    heightLimit: "",
    farLimit: "",
    siteArea: json.properties.SHAPE_AREA.toFixed(2),
    lead: "",
    siteWorldCoordinates: getCentroidFromCoordinates(json.geometry.coordinates[0])!,
    coordinates: json.geometry.coordinates[0],
    description: json.properties.OBJECT_LAYER,
    envelopeCoordinates: json.geometry.coordinates[0],
    envelopeHeight: 0
  };

  return project;
};

export const getWorkspaceCoordinates = (projects: Project[]): { longitude: number; latitude: number } => {
  let projectCoordinates: number[][] = projects.map((project) => project.siteWorldCoordinates);
  var features = points(projectCoordinates);
  const coordinate = getCoord(center(features));
  return { longitude: coordinate[0], latitude: coordinate[1] };
};
