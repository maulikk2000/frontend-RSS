const baseUrl = process.env.REACT_APP_SCENARIO_SERVICE_BASE_URL || "";
const scenarioServiceBaseUrl = `${baseUrl}/api/scenarioservice`;

export const workspaces = () => {
  return `${scenarioServiceBaseUrl}/v2/workspaces`;
};

export const workspace = (workspaceId: string) => {
  return `${scenarioServiceBaseUrl}/v2/workspaces/${workspaceId}`;
};

export const projects = (workspaceId?: string) => {
  const workspaceQuery = workspaceId ? `?workspaceId=${workspaceId}` : "";
  return `${scenarioServiceBaseUrl}/v2/projects${workspaceQuery}`;
};

export const project = (projectId: string) => {
  return `${scenarioServiceBaseUrl}/v2/project/${projectId}`;
};

export const scenarios = () => {
  return `${scenarioServiceBaseUrl}/v2/scenarios`;
};

export const scenario = (scenarioId: string) => {
  return `${scenarioServiceBaseUrl}/v2/scenario/${scenarioId}`;
};

export const projectScenarios = (projectId: string, count?: number) => {
  return `${scenarioServiceBaseUrl}/v2/projects/${projectId}/scenarios` + (count ? `?count=${count}` : "");
};

export const masterplans = (workspaceId: string) => `${scenarioServiceBaseUrl}/v2/workspaces/${workspaceId}/masterplan`;
