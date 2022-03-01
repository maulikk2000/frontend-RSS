const baseUrl = process.env.REACT_APP_BASE_API || "";
const buildingServiceUrl_V2 = `${baseUrl}/api/buildingservice/v2`;
//const buildingServiceUrl_V2 = `${process.env.REACT_APP_CUBS_SOLVE_BASE_URL}/api/buildingservice/v2`;

export const configurationsEndpoint = () => {
  return `${buildingServiceUrl_V2}/configurations`;
};

export const configurationEndpoint = (scenarioId: string) => {
  return `${buildingServiceUrl_V2}/configurations?scenarioId=${scenarioId}&orderBy=CreatedDesc`;
};

export const flowsEndpoint = () => {
  return `${buildingServiceUrl_V2}/flows`;
};

export const flowTraceEndpoint = (flowId: string) => {
  return `${buildingServiceUrl_V2}/flows/${flowId}/trace`;
};
