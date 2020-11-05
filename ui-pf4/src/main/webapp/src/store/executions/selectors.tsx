import { RootState } from "../rootReducer";
import { stateKey } from "./reducer";

export const executionsState = (state: RootState) => state[stateKey];

export const selectExecutions = (state: RootState, projectId: string) =>
  executionsState(state).byId.get(projectId);

export const selectExecutionsFetchStatus = (
  state: RootState,
  organizationId: string
) => executionsState(state).fetchStatus.get(organizationId);

export const selectExecutionsFetchError = (
  state: RootState,
  organizationId: string
) => executionsState(state).errors.get(organizationId);
