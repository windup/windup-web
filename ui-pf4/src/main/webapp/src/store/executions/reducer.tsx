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
  byId: Map<string, WindupExecution[]>;
  errors: Map<string, AxiosError | undefined>;
  fetchStatus: Map<string, FetchStatus>;
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
          action.payload.projectId.toString(),
          "inProgress"
        ),
      };
    case getType(fetchExecutionsSuccess):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(
          action.meta.projectId.toString(),
          "complete"
        ),
        byId: new Map(state.byId).set(action.meta.projectId.toString(), [
          ...action.payload,
        ]),
        errors: new Map(state.errors).set(
          action.meta.projectId.toString(),
          undefined
        ),
      };
    case getType(fetchExecutionFailure):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(
          action.meta.projectId.toString(),
          "complete"
        ),
        errors: new Map(state.errors).set(
          action.meta.projectId.toString(),
          action.payload
        ),
      };
    default:
      return state;
  }
}
