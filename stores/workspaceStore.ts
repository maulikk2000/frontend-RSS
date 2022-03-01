import { createStore, createHook, StoreActionApi, createSelector } from "react-sweet-state";
import { messageStoreActions } from "types/extensions/messageExtension";
import { WorkspaceStoreState, Workspace } from "types/workspace";
import { FormattingEnum } from "utils/constants";
import { getMasterplans, getWorkspace, getWorkspaces } from "api/scenarioService/scenarioApi";
import { ApiCallState } from "types/common";
import { WorkspaceUnitSystem } from "types/workspace";
import { getApiErrorMessage } from "utils/errorUtils";

type StoreApi = StoreActionApi<WorkspaceStoreState>;
export type Actions = typeof actions;

const initialState: WorkspaceStoreState = {
  workspaces: [],
  getListState: ApiCallState.Idle,
  selectedWorkSpace: "",
  selectedWorkspaceId: "",
  masterplans: {}
};

const actions = {
  ...messageStoreActions,
  getWorkspaces: () => async ({ setState, getState }: StoreApi) => {
    try {
      if (getState().getListState === ApiCallState.Loading) {
        return;
      }

      setState({ getListState: ApiCallState.Loading });

      let workspaces = await getWorkspaces();
      workspaces = workspaces.map((workspace) => {
        const measurement =
          workspace.unitSystem === WorkspaceUnitSystem.Imperial
            ? {
                areaUnit: FormattingEnum.SquareFeet,
                largeAreaUnit: FormattingEnum.Acres,
                lengthUnit: FormattingEnum.Feet
              }
            : {
                areaUnit: FormattingEnum.SquareMeter,
                largeAreaUnit: FormattingEnum.Hectares,
                lengthUnit: FormattingEnum.Meter
              };
        return {
          ...workspace,
          measurement
        };
      });

      setState({
        workspaces,
        getListState: ApiCallState.Idle
      });
    } catch (err) {
      const errorMessage = "Unable to load your workspaces, please try again";
      setState({
        getListState: ApiCallState.Error,
        message: { text: errorMessage, variant: "error" }
      });
    }
  },

  getActiveMasterplans: () => ({ getState }) => {
    const selectedWorkSpaceId = getState().selectedWorkspaceId;

    return getState().masterplans?.[selectedWorkSpaceId];
  },

  getMasterplans: () => async ({ setState, getState }: StoreApi) => {
    try {
      if (getState().getSingleState === ApiCallState.Loading) {
        return;
      }

      setState({ getSingleState: ApiCallState.Loading });

      const selectedWorkSpaceId = getState().selectedWorkspaceId;

      setState({
        masterplans: {
          ...getState().masterplans,
          [selectedWorkSpaceId]: await getMasterplans(selectedWorkSpaceId)
        },
        getSingleState: ApiCallState.Idle
      });
    } catch (err) {
      const errorMessage = getApiErrorMessage(err, "Unable to load masterplans, please try again");
      setState({
        getSingleState: ApiCallState.Error,
        message: { text: errorMessage, variant: "error" }
      });
    }
  },

  getWorkspace: () => async ({ setState, getState }: StoreApi) => {
    try {
      const selectedWorkSpaceId = getState().selectedWorkspaceId;
      const workspaceDetails = await getWorkspace(selectedWorkSpaceId);
      const workspaces = getState().workspaces?.map((workspace) => {
        if (workspace.id === selectedWorkSpaceId) {
          return {
            ...workspace,
            parcelSelectionMapLayer: workspaceDetails.parcelSelectionMapLayer
          };
        }
        return workspace;
      });
      setState({
        workspaces,
        getSingleState: ApiCallState.Idle
      });
    } catch (err) {
      const errorMessage = getApiErrorMessage(err, "Unable to load workspace, please try again");
      setState({
        getSingleState: ApiCallState.Error,
        message: { text: errorMessage, variant: "error" }
      });
    }
  },

  setSelectedWorkspace: (selectedWorkspace: string) => async ({ setState, getState, dispatch }: StoreApi) => {
    let workspaces = getState().workspaces;
    if (workspaces.length === 0) {
      await dispatch(actions.getWorkspaces());
    }

    const workspace = getState().workspaces.find((w) => w.name === selectedWorkspace);

    if (workspace) {
      setState({
        selectedWorkSpace: selectedWorkspace,
        selectedWorkspaceId: workspace.id
      });
    }
  },

  resetWorkspaceStoreState: () => ({ setState }: StoreApi) => {
    setState({ ...initialState });
  }
};

const getSelectedWorkspace = createSelector<WorkspaceStoreState, void, Workspace | undefined, Workspace[], string>(
  [(state: WorkspaceStoreState) => state.workspaces, (state: WorkspaceStoreState) => state.selectedWorkspaceId],
  (workspaces, selectedWorkspaceId) => workspaces.find((p) => p.id === selectedWorkspaceId)
);

const workspaceStore = createStore<WorkspaceStoreState, Actions>({
  initialState,
  actions,
  name: "Workspace Store"
});

export const useSelectedWorkspace = createHook<WorkspaceStoreState, Actions, Workspace | undefined>(workspaceStore, {
  selector: getSelectedWorkspace
});

export const useWorkspaceStore = createHook(workspaceStore);
