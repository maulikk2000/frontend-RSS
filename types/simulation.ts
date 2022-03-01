import { ModelData } from "pages/configurator/components/LoFiViewer/Simulation/ModelViewer/ModelData";

export type SimulationState = {
  selectedSimulationAnalysis?: SimulationAnalysis;
  selectedWindCategory: string;
  selectedSunExposureCategory: SunExposureCategory;
  minMaxPerSunExposureCategory?: Record<SunExposureCategory, { min: number; max: number }>;
};

export type SimulationAnalysisType = "Solar" | "Wind";

export type SimulationAnalysis = {
  data: ModelData | undefined;
  type: SimulationAnalysisType | undefined;
  isDataLoading: boolean;
};

export type SunExposureCategory =
  | "Annual Average Daily Sunlight Hours"
  | "Annual Hours in the Shade"
  | "Annual Potential Sunlight Hours"
  | "Winter Daily Sunlight Hours"
  | "Winter Potential Sunlight hours";
