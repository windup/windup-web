import { RootState } from "../rootReducer";
import { stateKey } from "./reducer";

export const configurationOptionsState = (state: RootState) => state[stateKey];

export const configurationOptions = (state: RootState) => {
  return configurationOptionsState(state).items;
};
export const status = (state: RootState) =>
  configurationOptionsState(state).status;
export const error = (state: RootState) =>
  configurationOptionsState(state).error;
