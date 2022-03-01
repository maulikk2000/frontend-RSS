import { getSite } from "api/buildingService/buildingApiV1";
import { ModelData } from "pages/configurator/components/LoFiViewer/Simulation/ModelViewer/ModelData";
import { createStore, createHook, StoreActionApi } from "react-sweet-state";
import { SimulationAnalysisType, SimulationState, SunExposureCategory } from "types/simulation";

type SimulationStoreActions = typeof actions;
type StoreApi = StoreActionApi<SimulationState>;

const initialState: SimulationState = {
  selectedSimulationAnalysis: undefined,
  selectedWindCategory: "Lawson-2001-values",
  selectedSunExposureCategory: "Annual Average Daily Sunlight Hours",
  minMaxPerSunExposureCategory: undefined
};

const actions = {
  setSelectedSimulationAnalysisType: (type: SimulationAnalysisType) => ({ setState }: StoreApi) => {
    setState({
      selectedSimulationAnalysis: {
        data: undefined,
        type,
        isDataLoading: true
      }
    });
  },
  setSimulationAnalysisData: (data: ModelData) => ({ setState, getState }: StoreApi) => {
    const existingState = { ...getState().selectedSimulationAnalysis };
    setState({
      selectedSimulationAnalysis: {
        type: existingState ? existingState.type : undefined,
        data,
        isDataLoading: false
      }
    });
  },

  setSimulationAnalysisDataLoadFailed: () => ({ setState, getState }: StoreApi) => {
    const existingState = { ...getState().selectedSimulationAnalysis };
    setState({
      selectedSimulationAnalysis: {
        data: existingState ? existingState.data : undefined,
        type: existingState ? existingState.type : undefined,
        isDataLoading: false
      }
    });
  },
  setSelectedSunExposureCategory: (sunExposureCategory: SunExposureCategory) => ({ setState }: StoreApi) => {
    setState({
      selectedSunExposureCategory: sunExposureCategory
    });
  },
  setSelectedWindCategory: (selectedWindCategory: string) => ({ setState }: StoreApi) => {
    setState({ selectedWindCategory });
  },
  setMinMaxPerSunExposureCategory: (
    minMaxPerSunExposureCategory: Record<SunExposureCategory, { min: number; max: number }>
  ) => ({ setState }: StoreApi) => {
    setState({
      minMaxPerSunExposureCategory
    });
  },
  viewingSimulation: () => ({ getState }: StoreApi) => {
    const selected = getState().selectedSimulationAnalysis;

    return selected && selected?.type;
  },

  resetSimulationStoreState: () => ({ setState }: StoreApi) => {
    setState({ ...initialState });
  }
};

const simulationStore = createStore<SimulationState, SimulationStoreActions>({
  initialState,
  actions,
  name: "Simulation Store"
});

export const useSimulationStore = createHook(simulationStore);
