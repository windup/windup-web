import { AxiosError } from "axios";
import { ActionType, getType } from "typesafe-actions";
import { FetchStatus } from "store/common";
import {
  fetchExecutionRequest,
  fetchExecutionSuccess,
  fetchExecutionFailure,
} from "./actions";
import { WindupExecution } from "models/api";

export const stateKey = "execution";

export type ExecutionsState = Readonly<{
  byId: Map<number, WindupExecution>;
  errors: Map<number, AxiosError | undefined>;
  fetchStatus: Map<number, FetchStatus>;
}>;

export const defaultState: ExecutionsState = {
  byId: new Map(),
  errors: new Map(),
  fetchStatus: new Map(),
};

export type ExecutionsAction = ActionType<
  | typeof fetchExecutionRequest
  | typeof fetchExecutionSuccess
  | typeof fetchExecutionFailure
>;

export function executionReducer(
  state = defaultState,
  action: ExecutionsAction
): ExecutionsState {
  switch (action.type) {
    case getType(fetchExecutionRequest):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(
          action.payload.executionId,
          "inProgress"
        ),
      };
    case getType(fetchExecutionSuccess):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(
          action.meta.executionId,
          "complete"
        ),
        byId: new Map(state.byId).set(action.meta.executionId, {
          ...action.payload,
        }),
        errors: new Map(state.errors).set(action.meta.executionId, undefined),
      };
    case getType(fetchExecutionFailure):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(
          action.meta.executionId,
          "complete"
        ),
        errors: new Map(state.errors).set(
          action.meta.executionId,
          action.payload
        ),
      };
    default:
      return state;
  }
}
