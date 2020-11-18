import { RootState } from "../rootReducer";
import { stateKey } from "./reducer";

export const projectExecutionsState = (state: RootState) => state[stateKey];

export const selectProjectExecutions = (state: RootState, projectId: string) =>
  projectExecutionsState(state).byId.get(projectId);

export const selectProjectExecutionsFetchStatus = (
  state: RootState,
  organizationId: string
) => projectExecutionsState(state).fetchStatus.get(organizationId);

export const selectProjectExecutionsFetchError = (
  state: RootState,
  organizationId: string
) => projectExecutionsState(state).errors.get(organizationId);
