import { AxiosError } from "axios";
import { ActionType, getType } from "typesafe-actions";
import { FetchStatus } from "store/common";
import {
  fetchProjectExecutionsRequest,
  fetchProjectExecutionsSuccess,
  fetchProjectExecutionsFailure,
} from "./actions";
import { WindupExecution } from "models/api";

export const stateKey = "projectExecutions";

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
  | typeof fetchProjectExecutionsRequest
  | typeof fetchProjectExecutionsSuccess
  | typeof fetchProjectExecutionsFailure
>;

export function projectExecutionsReducer(
  state = defaultState,
  action: ExecutionsAction
): ExecutionsState {
  switch (action.type) {
    case getType(fetchProjectExecutionsRequest):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(
          action.payload.projectId.toString(),
          "inProgress"
        ),
      };
    case getType(fetchProjectExecutionsSuccess):
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
    case getType(fetchProjectExecutionsFailure):
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
