import { RootState } from "../rootReducer";
import { stateKey } from "./reducer";

export const executionsState = (state: RootState) => state[stateKey];

export const selectWebsocket = (state: RootState, executionId: number) =>
  executionsState(state).byId.get(executionId);

export const selectMessage = (state: RootState, executionId: number) =>
  executionsState(state).messageById.get(executionId);

// If used in redux hook 'useSelector' then use 'shallowEqual'
// to avoid multiple renders
export const selectMessagesByProjectId = (
  state: RootState,
  projectId: number
) =>
  Array.from(executionsState(state).messageById.values()).filter(
    (f) => f.projectId === projectId
  );
