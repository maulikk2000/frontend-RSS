import { createStore, createHook } from "react-sweet-state";
import { MutableRefObject } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export type MeshReferenceActions = typeof actions;

export type MeshReferenceStoreState = {
  orbitRef: MutableRefObject<OrbitControls> | null;
};

const initialState: MeshReferenceStoreState = {
  orbitRef: null
};

export const actions = {
  setOrbitRef: (orbitRef: MutableRefObject<OrbitControls | undefined>) => ({ setState }) => {
    setState({
      orbitRef
    });
  }
};

const meshReferences = createStore<MeshReferenceStoreState, MeshReferenceActions>({
  initialState,
  actions,
  name: "Mesh Reference Store"
});

export const useMeshReferenceStore = createHook(meshReferences);
