import { RootState } from "../rootReducer";
import { stateKey } from "./reducer";

export const projectContextState = (state: RootState) => state[stateKey];

export const projects = (state: RootState) => {
  return projectContextState(state).projects;
};
export const projectsFetchStatus = (state: RootState) =>
  projectContextState(state).projectsFetchStatus;
export const projectsFetchError = (state: RootState) =>
  projectContextState(state).projectsFetchError;

export const selectedProject = (state: RootState) =>
  projectContextState(state).selected;
