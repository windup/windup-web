import { RootState } from "../rootReducer";
import { stateKey } from "./reducer";

export const executionsState = (state: RootState) => state[stateKey];

export const selectExecution = (state: RootState, executionId: number) =>
  executionsState(state).byId.get(executionId);

export const selectExecutionFetchStatus = (
  state: RootState,
  executionId: number
) => executionsState(state).fetchStatus.get(executionId);

export const selectExecutionFetchError = (
  state: RootState,
  executionId: number
) => executionsState(state).errors.get(executionId);
