import { ApiCallState } from "types/common";

// Union type MessageStoreState with any StoreState type to get additional message related properties.
export type ApiCallStoreState = {
  getListState?: ApiCallState;
  getSingleState?: ApiCallState;
  createState?: ApiCallState;
  updateState?: ApiCallState;
  deleteState?: ApiCallState;
};
