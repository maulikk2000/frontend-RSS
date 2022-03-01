import { createStore, createHook } from "react-sweet-state";

export type ConfiguratorSettingsActions = typeof actions;

export type ConfiguratorSettingsState = {
  editorPanelEnabled: boolean;
  is2D: boolean;
  animateSun: boolean;
};

const initialState: ConfiguratorSettingsState = {
  editorPanelEnabled: false,
  is2D: false,
  animateSun: false
};

const actions = {
  setEditorPanelEnabled: (editorPanelEnabled: boolean) => ({ setState }) => {
    setState({
      ...initialState,
      editorPanelEnabled,
      // turn off edit mode when panel is opened and closed
      editMode: false
    });
  },

  setAnimateSun: (animateSun: boolean) => ({ setState }) => {
    setState({
      animateSun
    });
  },

  set2D: (is2D: boolean) => ({ setState }) => {
    setState({
      is2D
    });
  }
};

const ConfiguratorSettingsStore = createStore<ConfiguratorSettingsState, ConfiguratorSettingsActions>({
  initialState,
  actions,
  name: "Configurator Settings Store"
});

export const useConfiguratorSettingsStore = createHook(ConfiguratorSettingsStore);
