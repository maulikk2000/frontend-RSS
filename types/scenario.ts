import { PlotMetrics, SiteMetrics } from "pages/configurator/data/v2/buildingDatav2";
import { ApiCallState } from "./common";
import { ApiCallStoreState } from "./extensions/apiCallStateExtension";
import { MessageStoreState } from "./extensions/messageExtension";
import { SiteNoteObject } from "./siteNote";

export type Scenario = {
  id: string;
  name: string;
  description: string;
  owner: string;
  status: string;
  created: string;
  siteNotes: SiteNoteObject[];
  updated?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  phase?: number;
  isBaselineScenario?: boolean;
} & ScenarioKeyMetrics;

export type ScenarioKeyMetrics = {
  id: string;
  bomaGea?: number;
  bomaBEfficiency?: number;
  yield?: number;
};

export type ScenarioStoreState = MessageStoreState &
  ApiCallStoreState & {
    scenarios: Scenario[];
    selectedScenarioIds: string[];

    scenariosComparison: ScenarioComparisonModel[];
    compareScenariosState: ApiCallState;
  };

export type ScenarioComparisonModel = {
  scenarioId: string;
  plots: ScenarioComparisonPlot[];
  siteMetrics: SiteMetrics;
};

export type ScenarioComparisonPlot = {
  label: string;
  plotMetrics: PlotMetrics;
};

export type CreateScenarioRequest = {
  projectId: string;
  parentId?: string;
  name: string;
  description: string;
  isBaselineScenario?: boolean;
};

export type UpdateScenarioRequest = {
  id: string;
  name: string;
  description: string;
  owner: string;
  status: string;
  phase?: number;
  isBaselineScenario?: boolean;
};

export enum ScenarioPhase {
  Draft = 0,
  Rejected,
  Solved
}

export const ScenarioPhaseNames = ["Draft Massing", "Design Rejected", "Floorplate Generated"];

export const getPhaseName = (phase: number): string => {
  return ScenarioPhaseNames[phase];
};

export const ScenarioStatus = ["InProgress", "Completed", "Cancelled"];
