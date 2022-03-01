import {
  masterplans,
  project,
  projects,
  projectScenarios,
  scenario,
  scenarios,
  workspace,
  workspaces
} from "./scenarioEndpoints";
import { CreateProjectRequest, Project } from "types/project";
import axios from "api/axios-eli";
import { CreateScenarioRequest, Scenario, ScenarioKeyMetrics, UpdateScenarioRequest } from "types/scenario";
import { getSite } from "api/buildingService/buildingApiV1";
import { Workspace } from "types/workspace";
import { GeoJSON } from "geojson";

type Token = {
  token: string;
  ssl: boolean;
};
export const getToken = async (): Promise<Token> => {
  let response = await axios.get("https://dev.eli.digital/api/tokenservice/v1/EsriToken/");
  return response.data;
};

export const getWorkspaces = async (): Promise<Workspace[]> => {
  let response = await axios.get(workspaces());
  return response.data.workspaces;
};

export const getWorkspace = async (workspaceId: string): Promise<Workspace> => {
  let response = await axios.get(workspace(workspaceId));
  return response.data;
};

export const getProjects = async (workspaceId: string): Promise<Project[]> => {
  let rawProjectsResponse = await axios.get(projects(workspaceId));

  return rawProjectsResponse.data.projects;
};

export const createProject = async (
  workspaceId: string,
  createProjectRequest: CreateProjectRequest
): Promise<Project> => {
  let rawProjectsResponse = axios.post(projects(workspaceId), createProjectRequest);

  return (await rawProjectsResponse).data;
};

export const updateProject = async (project: Project): Promise<Project> => {
  let rawProjectsResponse = axios.patch(`${projects()}/${project.id}`, project, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  return (await rawProjectsResponse).data;
};

export const deleteProject = async (projectId: string): Promise<void> => {
  axios.delete(`${projects()}/${projectId}`);
};

export const getProject = async (projectId: string): Promise<Project> => {
  let rawProjectResponse = await axios.get(project(projectId));

  return rawProjectResponse.data;
};

export const getProjectScenarios = async (projectId: string, count?: number): Promise<Scenario[]> => {
  let rawScenariosResponse = await axios.get(projectScenarios(projectId, count));

  return rawScenariosResponse.data.scenarios;
};

export const getScenario = async (scenarioId: string): Promise<Scenario> => {
  let rawScenarioResponse = await axios.get(scenario(scenarioId));

  return rawScenarioResponse.data;
};

export const createScenario = async (createScenarioRequest: CreateScenarioRequest): Promise<Scenario> => {
  let rawScenariosResponse = axios.post(scenarios(), createScenarioRequest);

  return (await rawScenariosResponse).data.scenarioBranch.scenario;
};

export const updateScenario = async (updateScenarioRequest: UpdateScenarioRequest): Promise<Scenario> => {
  let rawScenariosResponse = axios.patch(scenarios(), updateScenarioRequest, {});

  return (await rawScenariosResponse).data;
};

export const getScenariosKeyMetrics = async (scenarioIds: string[]): Promise<ScenarioKeyMetrics[]> => {
  return await Promise.all(
    scenarioIds.map(async (scenarioId: string) => {
      const siteResponse = await getSite(scenarioId);

      const { floorPlateMetrics, unitMetrics } = siteResponse.siteMetrics;

      return {
        id: scenarioId,
        bomaGea: floorPlateMetrics.bomagea,
        bomaBEfficiency: floorPlateMetrics.residentialEfficiencyBOMAB,
        yield: unitMetrics.reduce((accumulator, mix) => accumulator + mix.yield, 0)
      };
    })
  );
};

export const getMasterplans = async (workspaceId: string): Promise<GeoJSON.FeatureCollection> =>
  (await axios.get(masterplans(workspaceId)))?.data ?? {};
