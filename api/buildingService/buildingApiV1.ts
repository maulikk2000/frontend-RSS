import axios from "api/axios-eli";
import { geometriesEndpoint, sitesEndpoint } from "./buildingEndpointsV1";

export const getSite = async (scenarioId: string): Promise<any> => {
  let rawSiteResponse = await axios.get(sitesEndpoint(scenarioId));

  return rawSiteResponse.data;
};

export const getGeometries = async (scenarioId: string): Promise<any> => {
  let rawGeometriesResponse = await axios.get(geometriesEndpoint(scenarioId));

  return rawGeometriesResponse.data;
};
