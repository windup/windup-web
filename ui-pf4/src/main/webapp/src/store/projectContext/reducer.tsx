import { AxiosError } from "axios";
import { ActionType, getType } from "typesafe-actions";

import { Project } from "models/api";
import {
  fetchProjectsRequest,
  fetchProjectsSuccess,
  fetchProjectsFailure,
  selectProjectContext,
} from "./actions";
import { FetchStatus } from "store/common";

export const stateKey = "projectContext";

export type ProjectContextState = Readonly<{
  selected: Project | undefined;
  projects: Project[];
  projectsFetchError: AxiosError | undefined;
  projectsFetchStatus: FetchStatus;
}>;

export const defaultState: ProjectContextState = {
  selected: undefined,
  projects: [],
  projectsFetchError: undefined,
  projectsFetchStatus: "none",
};

export type ProjectContextAction = ActionType<
  | typeof fetchProjectsRequest
  | typeof fetchProjectsSuccess
  | typeof fetchProjectsFailure
  | typeof selectProjectContext
>;

export function projectContextReducer(
  state = defaultState,
  action: ProjectContextAction
): ProjectContextState {
  switch (action.type) {
    case getType(fetchProjectsRequest):
      return {
        ...state,
        projectsFetchStatus: "inProgress",
      };
    case getType(fetchProjectsSuccess):
      return {
        ...state,
        projects: action.payload,
        projectsFetchError: undefined,
        projectsFetchStatus: "complete",
      };
    case getType(fetchProjectsFailure):
      return {
        ...state,
        projectsFetchError: action.payload,
        projectsFetchStatus: "complete",
      };

    case getType(selectProjectContext):
      return {
        ...state,
        selected: action.payload,
      };

    default:
      return state;
  }
}
