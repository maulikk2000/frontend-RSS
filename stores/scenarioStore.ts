import { createHook, createSelector, createStore, createSubscriber, defaults, StoreActionApi } from "react-sweet-state";
import { createScenario, getProjectScenarios, getScenario, updateScenario } from "../api/scenarioService/scenarioApi";
import { messageStoreActions } from "../types/extensions/messageExtension";
import { getApiErrorMessage } from "utils/errorUtils";
import {
  CreateScenarioRequest,
  Scenario,
  ScenarioComparisonModel,
  ScenarioPhase,
  ScenarioStoreState,
  UpdateScenarioRequest
} from "types/scenario";
import { ApiCallState } from "types/common";
import { getSite } from "api/buildingService/buildingApiV1";

defaults.devtools = true;
type StoreApi = StoreActionApi<ScenarioStoreState>;
type Actions = typeof actions;

const scenarioStoreInitialState: ScenarioStoreState = {
  scenarios: [],
  getListState: ApiCallState.Idle,
  getSingleState: ApiCallState.Idle,
  createState: ApiCallState.Idle,
  updateState: ApiCallState.Idle,

  selectedScenarioIds: [],

  scenariosComparison: [],
  compareScenariosState: ApiCallState.Idle
};

export const actions = {
  ...messageStoreActions,
  ...{
    getProjectScenarios: (projectId: string, count?: number) => async ({ setState, getState }: StoreApi) => {
      try {
        if (getState().getListState === ApiCallState.Loading || !projectId) {
          return;
        }

        setState({ getListState: ApiCallState.Loading });

        const scenarios = await getProjectScenarios(projectId, count);

        scenarios.sort((x, y) => {
          if (x.isBaselineScenario) {
            return -1;
          } else if (y.isBaselineScenario) {
            return 1;
          } else if ((x.phase ?? 0) !== (y.phase ?? 0) && x.phase === ScenarioPhase.Solved) {
            return -1;
          } else if (x.name > y.name) {
            return 1;
          } else {
            return 0;
          }
        });

        setState({
          scenarios,
          getListState: ApiCallState.Idle
        });
      } catch (err) {
        const errorMessage = getApiErrorMessage(err, "Error loading scenarios");
        setState({
          getListState: ApiCallState.Error,
          message: { text: errorMessage, variant: "error" }
        });
      }
    },

    getScenario: (scenarioId: string) => async ({ setState, getState, dispatch }: StoreApi) => {
      try {
        if (getState().getSingleState === ApiCallState.Loading || !scenarioId) {
          return;
        }

        setState({ getSingleState: ApiCallState.Loading });

        const scenario = await getScenario(scenarioId);

        if (scenario === null) {
          setState({ getSingleState: ApiCallState.Idle });
          return;
        }

        const scenariosCopy = dispatch(replaceScenarioInList(scenario));

        setState({
          scenarios: scenariosCopy,
          getSingleState: ApiCallState.Idle
        });
      } catch (err) {
        const errorMessage = getApiErrorMessage(err, "Error getting scenario");
        setState({
          getSingleState: ApiCallState.Error,
          message: { text: errorMessage, variant: "error" }
        });
      }
    },

    createScenario: (createScenarioRequest: CreateScenarioRequest) => async ({
      setState,
      getState,
      dispatch
    }: StoreApi) => {
      try {
        if (getState().createState === ApiCallState.Loading) {
          return null;
        }

        setState({
          createState: ApiCallState.Loading
        });

        const newScenario = await createScenario(createScenarioRequest);
        if (newScenario === null) {
          setState({ createState: ApiCallState.Idle });
          return null;
        }
        const scenariosCopy = dispatch(replaceScenarioInList(newScenario));
        setState({
          scenarios: scenariosCopy,
          createState: ApiCallState.Idle,
          message: {
            text: "A new scenario was created successfully.",
            variant: "success"
          }
        });
        return newScenario.id;
      } catch (error) {
        let errorMessage = getApiErrorMessage(error, "Error creating scenario");
        setState({
          createState: ApiCallState.Error,
          message: { text: errorMessage, variant: "error" }
        });
      }
    },

    updateScenario: (scenarioRequest: UpdateScenarioRequest) => async ({ setState, getState, dispatch }: StoreApi) => {
      try {
        if (getState().updateState === ApiCallState.Loading) {
          return;
        }

        setState({
          updateState: ApiCallState.Loading
        });

        const updatedScenario = await updateScenario(scenarioRequest);
        if (updatedScenario === null) {
          setState({ updateState: ApiCallState.Idle });
          return;
        }
        const scenariosCopy = dispatch(replaceScenarioInList(updatedScenario));
        setState({
          updateState: ApiCallState.Idle,
          scenarios: scenariosCopy,
          message: {
            text: "Scenario was updated successfully.",
            variant: "success"
          }
        });
      } catch (error) {
        const errorMessage = getApiErrorMessage(error, "Error updating scenario");
        setState({
          updateState: ApiCallState.Error,
          message: { text: errorMessage, variant: "error" }
        });
      }
    },

    getScenariosComparison: (...scenarioIds: string[]) => async ({ getState, setState }: StoreApi) => {
      try {
        if (getState().compareScenariosState === ApiCallState.Loading || scenarioIds.length === 0) {
          return;
        }

        setState({
          compareScenariosState: ApiCallState.Loading
        });

        const scenariosMetrics = await Promise.all(
          scenarioIds.map(async (sid) => {
            let site = await getSite(sid);

            return {
              scenarioId: sid,
              plots: site.plots
                ? site.plots.map((pp) => {
                    return {
                      label: pp.label,
                      plotMetrics: pp.plotMetrics
                    };
                  })
                : [],
              siteMetrics: site.siteMetrics
            } as ScenarioComparisonModel;
          })
        );
        setState({
          scenariosComparison: [...getState().scenariosComparison, ...scenariosMetrics],
          compareScenariosState: ApiCallState.Idle
        });
      } catch (error) {
        let errorMessage = getApiErrorMessage(error, "Error loading scenario comparison data");
        setState({
          compareScenariosState: ApiCallState.Error,
          message: { text: errorMessage, variant: "error" }
        });
      }
    },

    setCreateScenarioState: (state: ApiCallState) => ({ setState }: StoreApi) => {
      setState({
        createState: state
      });
    },

    setSelectedScenario: (id: string) => ({ dispatch }: StoreApi) => {
      dispatch(setScenarioSelections([id]));
    },

    setSelectedScenarios: (scenarioIds: string[]) => ({ dispatch }: StoreApi): void => {
      dispatch(setScenarioSelections(scenarioIds));
    },

    toggleSelectedScenarios: (scenario: Scenario) => ({ getState, dispatch }: StoreApi) => {
      const state = getState();
      const selectedScenarioList = [...state.selectedScenarioIds];
      const existingScenarioIndex = selectedScenarioList.findIndex((s) => scenario.id === s);

      if (existingScenarioIndex !== -1) {
        selectedScenarioList.splice(existingScenarioIndex, 1);
      } else {
        selectedScenarioList.push(scenario.id);
      }

      dispatch(setScenarioSelections(selectedScenarioList));
    },

    clearSelectedScenarios: () => ({ dispatch }: StoreApi) => {
      dispatch(setScenarioSelections([]));
    },

    clearScenarioComparison: () => ({ setState }: StoreApi) => {
      setState({
        scenariosComparison: [],
        compareScenariosState: ApiCallState.Idle
      });
    },

    resetScenarioStore: () => ({ setState }: StoreApi) => {
      setState({
        ...scenarioStoreInitialState
      });
    }
  }
};

const setScenarioSelections = (scenarioIds: string[]) => async ({
  setState,
  getState,
  dispatch
}: StoreApi): Promise<void> => {
  const uniqueScenarioIds = [...new Set(scenarioIds.map((id) => id.trim()))];

  if (uniqueScenarioIds.length > 3) {
    setState({
      message: {
        text: "You cannot select more than 3 scenarios at once",
        variant: "warning"
      }
    });
    return;
  }

  if (uniqueScenarioIds.length > 0) {
    const scenarios = getSelectedScenariosByIds(getState().scenarios, uniqueScenarioIds);
    if (scenarios.length !== uniqueScenarioIds.length) {
      // TODO: Use bulk api call once endpoint to get scenario by ids works https://lendleasegroup.atlassian.net/browse/ENV-1033
      for (let i = 0; i < uniqueScenarioIds.length; i++) {
        await dispatch(actions.getScenario(uniqueScenarioIds[i]));
      }
    }
  }

  setState({
    selectedScenarioIds: uniqueScenarioIds
  });
};

const replaceScenarioInList = (newScenario: Scenario) => ({ getState }: StoreApi): Scenario[] => {
  let scenariosCopy = [...getState().scenarios];
  let existingScenarioIndex = scenariosCopy.findIndex((s) => s.id === newScenario.id);

  if (existingScenarioIndex !== -1) {
    scenariosCopy.splice(existingScenarioIndex, 1, newScenario);
  } else {
    scenariosCopy.push(newScenario);
  }
  return scenariosCopy;
};

const getSelectedScenariosByIds = (scenarios: Scenario[], scenarioIds: string[]) =>
  scenarios.filter((s) => scenarioIds.some((selected) => selected === s.id));

const getSelectedScenarios = createSelector<ScenarioStoreState, void, Scenario[], Scenario[], string[]>(
  [(state: ScenarioStoreState) => state.scenarios, (state: ScenarioStoreState) => state.selectedScenarioIds],
  getSelectedScenariosByIds
);

const scenarioStore = createStore<ScenarioStoreState, Actions>({
  initialState: scenarioStoreInitialState,
  actions,
  name: "Scenario Store"
});

export const useScenarioStore = createHook<ScenarioStoreState, Actions>(scenarioStore);

export const ScenarioSubcriber = createSubscriber<ScenarioStoreState, Actions>(scenarioStore);

export const useSelectedScenarios = createHook<ScenarioStoreState, Actions, Scenario[]>(scenarioStore, {
  selector: getSelectedScenarios
});
