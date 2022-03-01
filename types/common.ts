export enum ApiCallState {
  Init = 0,
  Idle,
  Loading,
  Error
}

export enum ApiCallStateClear {
  Cleared = 4
}

export type ApiCallStateWithCleared = ApiCallState | ApiCallStateClear;

export interface KeyValuePair<keyType, valueType> {
  key: keyType;
  value: valueType;
}
