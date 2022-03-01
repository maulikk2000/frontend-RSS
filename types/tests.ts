import { HookFunction, BoundActions, ActionThunk } from "react-sweet-state";

// Gives us type safety when mocking useStore hooks,
// while allowing us to only specify the bits (store state, actions) that we care about
// for a specific test.
export type MockedUseStoreHook<
  TState,
  TActions extends Record<string, ActionThunk<TState, TActions>>
> = jest.MockedFunction<HookFunction<Partial<TState>, Partial<BoundActions<TState, TActions>>>>;
