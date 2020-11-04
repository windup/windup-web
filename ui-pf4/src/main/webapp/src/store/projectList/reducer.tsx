import { AxiosError } from "axios";
import { ActionType, getType } from "typesafe-actions";
import { Project } from "../../models/api";
import { FetchStatus } from "../common";
import {
  fetchProjectListRequest,
  fetchProjectListSuccess,
  fetchProjectListFailure,
} from "./actions";

export const stateKey = "projectList";

export type ProjectListState = Readonly<{
  projects: Project[] | undefined;
  error: AxiosError | undefined;
  status: FetchStatus;
}>;

export const defaultState: ProjectListState = {
  projects: undefined,
  error: undefined,
  status: "none",
};

export type ProjectListAction = ActionType<
  | typeof fetchProjectListRequest
  | typeof fetchProjectListSuccess
  | typeof fetchProjectListFailure
>;

export function projectListReducer(
  state = defaultState,
  action: ProjectListAction
): ProjectListState {
  switch (action.type) {
    case getType(fetchProjectListRequest):
      return {
        ...state,
        status: "inProgress",
      };
    case getType(fetchProjectListSuccess):
      return {
        ...state,
        status: "complete",
        error: undefined,
        projects: action.payload,
      };
    case getType(fetchProjectListFailure):
      return {
        ...state,
        status: "complete",
        error: action.payload,
      };
    default:
      return state;
  }
}
