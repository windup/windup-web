import { AxiosError } from "axios";
import { ActionType, getType } from "typesafe-actions";
import { FetchStatus } from "store/common";
import {
  fetchExecutionsRequest,
  fetchExecutionsSuccess,
  fetchExecutionFailure,
} from "./actions";
import { WindupExecution } from "models/api";

export const stateKey = "executions";

export type ExecutionsState = Readonly<{
  byId: Map<string | number, WindupExecution[]>;
  errors: Map<string | number, AxiosError | undefined>;
  fetchStatus: Map<string | number, FetchStatus>;
}>;

export const defaultState: ExecutionsState = {
  byId: new Map(),
  errors: new Map(),
  fetchStatus: new Map(),
};

export type ExecutionsAction = ActionType<
  | typeof fetchExecutionsRequest
  | typeof fetchExecutionsSuccess
  | typeof fetchExecutionFailure
>;

export function executionsReducer(
  state = defaultState,
  action: ExecutionsAction
): ExecutionsState {
  switch (action.type) {
    case getType(fetchExecutionsRequest):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(
          action.payload.projectId,
          "inProgress"
        ),
      };
    case getType(fetchExecutionsSuccess):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(
          action.meta.projectId,
          "complete"
        ),
        byId: new Map(state.byId).set(action.meta.projectId, {
          ...action.payload,
        }),
        errors: new Map(state.errors).set(action.meta.projectId, undefined),
      };
    case getType(fetchExecutionFailure):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(
          action.meta.projectId,
          "complete"
        ),
        errors: new Map(state.errors).set(
          action.meta.projectId,
          action.payload
        ),
      };
    default:
      return state;
  }
}
