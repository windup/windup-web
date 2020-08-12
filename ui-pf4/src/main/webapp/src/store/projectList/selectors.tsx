import { RootState } from "../rootReducer";
import { stateKey } from "./reducer";

export const projectListState = (state: RootState) => state[stateKey];

export const projects = (state: RootState) => {
  return projectListState(state).projects;
};
export const status = (state: RootState) => projectListState(state).status;
export const error = (state: RootState) => projectListState(state).error;
