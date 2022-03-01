import { createStore, createHook, StoreActionApi, defaults } from "react-sweet-state";
import axios from "api/axios-eli";
import { Object3D } from "three";
import {
  getContractFromPlotConfiguration,
  getConfigurationFromPlotContract,
  addPodiumToBaseConfiguration
} from "./storeUtils";
import { CancelTokenSource } from "axios";
import { CONFIGURATOR_STATE } from "../data/enums";
import {
  BuildingGeometries,
  Tower,
  BuildingServiceState,
  SiteConfiguration,
  V2CreateFlow,
  V2Flow,
  V2Step,
  BuildingServiceError,
  SiteConfigurationContract,
  Plot
} from "../data/v2/types";
import { GLTFJsonToUrl, loadAndStoreGLTFsAsObjects } from "../utilities/solverUtils";
import { messageStoreActions } from "types/extensions/messageExtension";
import { buildingServiceConfigurationActions } from "./buildingServiceConfigurationActions";
import { ConfiguratorObjects } from "../utilities/configurationUtils";
import { BuildingV2 } from "../data/v2/buildingDatav2";
import { cloneDeep } from "lodash-es";
import { getApiErrorMessage } from "utils/errorUtils";
import { ScenarioPhase } from "types/scenario";
import { ApiCallState } from "types/common";
import { getGeometries, getSite } from "api/buildingService/buildingApiV1";
import { createConfiguration, createFlow, getConfiguration, getFlowTrace } from "api/buildingService/buildingApiV2";

export type BuildingServiceStoreApi = StoreActionApi<BuildingServiceState>;

export type BuildingServiceStoreActions = typeof actions;

defaults.devtools = true;

export const initialState: BuildingServiceState = {
  selectedObjectIndex: 0,
  selectedPlotIndex: 0,
  configuration: null,
  siteConfigurationState: ApiCallState.Idle,
  geometries: null,
  objects: null,
  cancelSource: axios.CancelToken.source(),
  status: null,
  trace: null,
  errors: null,
  building: null,
  buildingState: ApiCallState.Idle
};

export const actions = {
  ...messageStoreActions,
  ...{
    setStatus: (status: CONFIGURATOR_STATE | null) => async ({ setState }) => {
      setState({
        status
      });
    },

    getConfigurationByScenarioId: (scenarioId: string) => async ({ setState }) => {
      try {
        setState({
          siteConfigurationState: ApiCallState.Loading
        });

        let response = await getConfiguration(scenarioId);

        let configuration = response.data[0];

        if (
          !configuration ||
          // for all old configs allow user to create a new configuration
          (configuration.towers && configuration.towers.length > 0)
        ) {
          setState({
            siteConfigurationState: ApiCallState.Idle
          });
          return;
        }

        let siteConfiguration: SiteConfiguration = getConfigurationFromPlotContract(configuration);

        setState({
          configuration: siteConfiguration,
          siteConfigurationState: ApiCallState.Idle
        });
      } catch (error) {
        let errorMessage = getApiErrorMessage(error, "Error loading configuration");

        setState({
          message: { text: errorMessage, variant: "error" },
          siteConfigurationState: ApiCallState.Idle
        });
      }
    },

    createConfiguration: (config: SiteConfiguration | null | undefined = null, callback?: () => void) => async ({
      setState,
      getState
    }) => {
      let configuration: SiteConfiguration;
      if (!config) {
        configuration = cloneDeep(getState().configuration);
      } else {
        configuration = cloneDeep(config);

        // set the configuration on creation before converting to
        // BE contract and retreiving again
        setState({
          ...getState(),
          configuration: config
        });
      }
      let configurationContract: SiteConfigurationContract = getContractFromPlotConfiguration(configuration);

      setState({
        siteConfigurationState: ApiCallState.Loading
      });

      configurationContract.podium = addPodiumToBaseConfiguration() as any;

      try {
        let configuration = await createConfiguration(configurationContract);

        let siteConfiguration: SiteConfiguration = getConfigurationFromPlotContract(configuration);

        setState({
          ...getState(),
          configuration: siteConfiguration,
          message: {
            text: "A new configuration was saved successfully.",
            variant: "success"
          },
          status: null,
          siteConfigurationState: ApiCallState.Idle
        });

        if (callback) {
          callback();
        }

        return;
      } catch (error) {
        let errorMessage = getApiErrorMessage(error, "Error saving configuration");

        setState({
          ...getState(),
          configuration: configuration,
          status: CONFIGURATOR_STATE.ERROR,
          errors: error.response?.data,
          message: { text: errorMessage, variant: "error" },
          siteConfigurationState: ApiCallState.Idle
        });
      }
    },

    createFlow: () => async ({ setState, getState, dispatch }) => {
      const configuration = { ...getState().configuration };

      // createConfiguration is called just before createFlow for some order logic;
      // as a result we do not want to attempt to create the flow after a failure
      if (getState().status === CONFIGURATOR_STATE.ERROR) {
        return;
      }

      const createBuildingRequest: V2CreateFlow = {
        configurationId: configuration.id,
        scenarioId: configuration.scenarioId,
        solvers: [
          {
            name: "FloorPlateLayout",
            platform: "RhinoComputeV2"
          }
        ]
      };

      // Create a cancellation token so user can cancel
      const cancelToken = axios.CancelToken;
      const cancelSource = cancelToken.source();

      setState({
        ...getState(),
        geometries: null,
        objects: null,
        building: null,
        selectedObjectIndex: 0,
        selectedPlotIndex: 0,
        trace: null,
        selectedItems: null,
        status: CONFIGURATOR_STATE.SOLVING,
        buildingState: ApiCallState.Loading
      });

      try {
        let flow: V2Flow = await createFlow(createBuildingRequest, cancelSource);

        const failedStep: V2Step | undefined = flow.steps.find((step) => !step.isSuccess);

        if (failedStep) {
          await dispatch(actions.getFlowTraceByFlowId(flow.id));

          let err: BuildingServiceError = {
            title: "At least one of the solvers has failed."
          };
          setState({
            flow,
            status: CONFIGURATOR_STATE.ERROR,
            errors: err,
            buildingState: ApiCallState.Idle
          });
        } else {
          setState({
            flow,
            status: CONFIGURATOR_STATE.SOLVED
          });

          await dispatch(actions.getBuilding(flow.siteId!));
        }
      } catch (error) {
        let err: BuildingServiceError;
        if (axios.isCancel(error)) {
          err = {
            title: "User cancelled request."
          };
        } else if (!error.response || error.response.status === 404) {
          err = {
            title: "Service cannot be found."
          };
        } else {
          err = error.response.data;
        }

        let errorMessage = getApiErrorMessage(error, "Error loading configuration");

        setState({
          ...getState(),

          status: CONFIGURATOR_STATE.ERROR,
          buildingState: ApiCallState.Idle,
          errors: err,
          message: { text: errorMessage, variant: "error" }
        });
      }
    },

    getFlowTraceByFlowId: (flowId: string) => async ({ setState }) => {
      let response = await getFlowTrace(flowId);
      setState({
        trace: response.config.url
      });
    },

    clearSolvedBuilding: () => async ({ setState }) => {
      setState({
        building: null,
        objects: null,
        status: CONFIGURATOR_STATE.EDIT,
        flow: null,
        geometries: null,
        buildingState: ApiCallState.Idle
      });
    },

    getBuildingServiceScenario: (scenarioId: string, scenarioPhase: number | undefined) => async ({ dispatch }) => {
      await dispatch(actions.getConfigurationByScenarioId(scenarioId));
      if (scenarioPhase === ScenarioPhase.Solved) {
        await dispatch(actions.getBuilding(scenarioId));
      }
    },

    loadGLTFs: (geometries: BuildingGeometries, building: BuildingV2) => async ({ setState, getState }) => {
      let objects: Array<Object3D> = await loadAndStoreGLTFsAsObjects(geometries, building, setState);
      setState({ ...getState(), objects });
    },

    setSelectedObjectIndex: (
      selectedObject: ConfiguratorObjects,
      selectedObjectIndex: number | null,
      selectedPlotIndex: number
    ) => ({ setState, getState }) => {
      const plot = getState().configuration.plots[selectedPlotIndex];
      // We currently use plots rather than podiums as it aligns podium interactions with the building metrics display. We can bring this back in the future if we refactor building metrics to use podium data.
      // if (selectedObject === "podium") {
      //   selectedObjectIndex = plot.towers.length;
      // } else
      if (selectedObject === "parking") {
        selectedObjectIndex = plot.towers.length + 1;
      } else if (selectedObject === "plot") {
        selectedObjectIndex = plot.towers.length + 2;
      } else if (selectedObject === null) {
        selectedObjectIndex = null;
      }
      setState({
        selectedObjectIndex,
        selectedPlotIndex
      });
    },

    updatePlotTowers: (towers: Tower[]) => ({ setState, getState }) => {
      const plots = getState().configuration.plots;
      const plot = plots[getState().selectedPlotIndex];
      plot.towers = towers;

      setState({
        configuration: {
          ...getState().configuration,
          plots
        }
      });
    },

    updatePlots: (plots: Plot[]) => ({ setState, getState }) => {
      setState({
        configuration: {
          ...getState().configuration,
          plots
        }
      });
    },

    clearSelectedObject: () => ({ setState }) => {
      setState({
        selectedObjectIndex: null
      });
    },

    setSelectedPlotIndex: (selectedPlotIndex: number) => ({ setState }) => {
      setState({ selectedPlotIndex });
    },

    setSelectedObjectIndexById: (selectedPlotId: string) => async ({ dispatch, getState }) => {
      if (getState().configuration) {
        const plots: Plot[] = getState().configuration.plots;
        const plot: Plot | undefined = plots.find((plot) => plot.id === selectedPlotId);
        if (plot) {
          await dispatch(actions.setSelectedObjectIndex("plot", plot.towers.length, plots.indexOf(plot)));
        }
      }
    },

    getBuilding: (scenarioId: string) => async ({ setState }) => {
      try {
        setState({
          status: CONFIGURATOR_STATE.SOLVING,
          buildingState: ApiCallState.Loading
        });

        let building = await getSite(scenarioId);

        let geometries = await getGeometries(scenarioId);

        const geometryURL = GLTFJsonToUrl(JSON.stringify(geometries));

        const buildingGeometries = {
          buildingId: "",
          data: [
            {
              geometry: {
                url: geometryURL
              },
              solverName: "FloorPlateLayout"
            }
          ]
        };

        setState({
          building,
          geometries: buildingGeometries,
          buildingState: ApiCallState.Idle
        });
      } catch (error) {
        // scenario not found - need to capture before this call - scenario status maybe stops initial call
        if (error.response.status === 404) {
          setState({
            building: null,
            buildingState: ApiCallState.Idle,
            geometries: null,
            status: null
          });
          return;
        }
        let errorMessage = getApiErrorMessage(error, "Error loading building V2");
        setState({
          status: null,
          message: { text: errorMessage, variant: "error" }
        });
      }
    },

    cancelApiCall: () => ({ setState, getState }) => {
      // Call this to cancel any tokens that are set by initial axios API call
      const cancelSource: CancelTokenSource = getState().cancelSource;
      cancelSource.cancel();

      setState({
        cancelSource,
        status: CONFIGURATOR_STATE.EDIT,
        errors: null,
        buildingState: ApiCallState.Idle
      });
    }
  },
  ...buildingServiceConfigurationActions
};

export const v2BuildingServiceStore = createStore<BuildingServiceState, BuildingServiceStoreActions>({
  initialState,
  actions,
  name: "Site Configuration Store"
});

export const useV2BuildingServiceStore = createHook<BuildingServiceState, BuildingServiceStoreActions>(
  v2BuildingServiceStore
);
