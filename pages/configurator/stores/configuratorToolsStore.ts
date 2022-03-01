import { Vector3 } from "three";
import create, { SetState } from "zustand";

export type ConfiguratorToolsState = {
  mode: ConfiguratorToolsMode;
  toggleMode: (mode: ConfiguratorToolsMode) => void;
  setMode: (mode: ConfiguratorToolsMode) => void;

  vertices: Vector3[];
  setVertices: (vertices: Vector3[]) => void;
  drawnVertices: Vector3[];

  addObjectType: ConfiguratorAddObjectType;
  setAddObjectType: (addObjectType: ConfiguratorAddObjectType) => void;
};

export type ConfiguratorToolsMode = "edit" | "add" | "draw" | "measure" | "none";

export type ConfiguratorAddObjectType = "Podium" | "Bar" | "LShape" | "none" | gRPC;
type gRPC = "gRPC";

const toggleMode = (mode: ConfiguratorToolsMode, state: ConfiguratorToolsState) =>
  mode === state.mode ? "none" : mode;

export const useConfiguratorToolsStore = create((set: SetState<ConfiguratorToolsState>) => ({
  mode: "none" as ConfiguratorToolsMode,
  toggleMode: (mode) => set((state) => ({ mode: toggleMode(mode, state) })),
  setMode: (mode) => set(() => ({ mode })),

  vertices: [],
  setVertices: (vertices) => set(() => ({ vertices })),
  drawnVertices: [],

  addObjectType: "none" as ConfiguratorAddObjectType,
  setAddObjectType: (addObjectType) => set(() => ({ addObjectType: addObjectType }))
}));
