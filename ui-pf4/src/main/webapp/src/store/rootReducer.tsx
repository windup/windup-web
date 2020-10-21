import { combineReducers } from "redux";
import { StateType } from "typesafe-actions";

import {
  configurationOptionStateKey,
  configurationOptionReducer,
} from "./configurationOptions";
import { deleteDialogStateKey, deleteDialogReducer } from "./deleteDialog";
import { executionsStateKey, executionsReducer } from "./executions";
import { executionsWsStateKey, executionsWsReducer } from "./executions-ws";
import {
  projectContextStateKey,
  projectContextReducer,
} from "./projectContext";
import { projectListStateKey, projectListReducer } from "./projectList";
import {
  ruleLabelDetailsModalStateKey,
  ruleLabelDetailsModalReducer,
} from "./ruleLabelDetailsModal";

const frontendComponentsNotifications = require("@redhat-cloud-services/frontend-components-notifications");

export type RootState = StateType<typeof rootReducer>;

export const rootReducer = combineReducers({
  [configurationOptionStateKey]: configurationOptionReducer,
  [deleteDialogStateKey]: deleteDialogReducer,
  [executionsStateKey]: executionsReducer,
  [executionsWsStateKey]: executionsWsReducer,
  [projectContextStateKey]: projectContextReducer,
  [projectListStateKey]: projectListReducer,
  [ruleLabelDetailsModalStateKey]: ruleLabelDetailsModalReducer,
  notifications: frontendComponentsNotifications.notifications,
});
