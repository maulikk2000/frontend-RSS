const baseUrl = process.env.REACT_APP_SCENARIO_SERVICE_BASE_URL || "";
const planningServiceBaseUrl = `${baseUrl}/api/planningservice`;

export const complianceData = (projectId: string) => {
  return `${planningServiceBaseUrl}/v1/compliance/${projectId}`;
};
