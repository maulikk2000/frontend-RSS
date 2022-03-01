const baseUrl = process.env.REACT_APP_BASE_API || "";
const buildingServiceUrl_V1 = `${baseUrl}/api/buildingservice/v1`;

export const sitesEndpoint = (scenarioId: string) => {
  return `${buildingServiceUrl_V1}/sites/${scenarioId}`;
};

export const geometriesEndpoint = (scenarioId: string) => {
  return `${buildingServiceUrl_V1}/sites/geometry/${scenarioId}/FloorPlateLayout`;
};
