import { AxiosError } from "axios";
import { ActionType, getType } from "typesafe-actions";
import { ConfigurationOption } from "models/api";
import { FetchStatus } from "../common";
import {
  fetchConfigurationOptionsRequest,
  fetchConfigurationOptionsSuccess,
  fetchConfigurationOptionsFailure,
} from "./actions";

export const stateKey = "configurationOptions";

export type ConfigurationOptionsState = Readonly<{
  items: ConfigurationOption[] | undefined;
  error: AxiosError | undefined;
  status: FetchStatus;
}>;

export const defaultState: ConfigurationOptionsState = {
  items: undefined,
  error: undefined,
  status: "none",
};

export type ConfigurationOptionsAction = ActionType<
  | typeof fetchConfigurationOptionsRequest
  | typeof fetchConfigurationOptionsSuccess
  | typeof fetchConfigurationOptionsFailure
>;

export function configurationOptionReducer(
  state = defaultState,
  action: ConfigurationOptionsAction
): ConfigurationOptionsState {
  switch (action.type) {
    case getType(fetchConfigurationOptionsRequest):
      return {
        ...state,
        status: "inProgress",
      };
    case getType(fetchConfigurationOptionsSuccess):
      return {
        ...state,
        status: "complete",
        error: undefined,
        items: action.payload,
      };
    case getType(fetchConfigurationOptionsFailure):
      return {
        ...state,
        status: "complete",
        error: action.payload,
      };
    default:
      return state;
  }
}
