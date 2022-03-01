import { createStore, createHook } from "react-sweet-state";

type Actions = typeof actions;

type ShadowDisplayState = {
  receiveShadows: boolean;
};

const initialState: ShadowDisplayState = {
  receiveShadows: true
};

const actions = {
  setReceiveShadows: (receiveShadows: boolean) => ({ setState, getState }) => {
    setState({
      receiveShadows: receiveShadows
    });
  },

  toggleReceiveShadows: (receiveShadows: boolean) => ({ setState, getState }) => {
    setState({
      receiveShadows: !receiveShadows
    });
  }
};

const shadowDisplayStore = createStore<ShadowDisplayState, Actions>({
  initialState,
  actions,
  name: "Layer Display Store"
});

export const useShadowDisplayStore = createHook(shadowDisplayStore);
