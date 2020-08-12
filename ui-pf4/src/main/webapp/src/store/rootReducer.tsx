import { combineReducers } from "redux";
import { StateType } from "typesafe-actions";

import { deleteDialogStateKey, deleteDialogReducer } from "./deleteDialog";
import { projectListStateKey, projectListReducer } from "./projectList";

const frontendComponentsNotifications = require("@redhat-cloud-services/frontend-components-notifications");

export type RootState = StateType<typeof rootReducer>;

export const rootReducer = combineReducers({
  [deleteDialogStateKey]: deleteDialogReducer,
  notifications: frontendComponentsNotifications.notifications,
  [projectListStateKey]: projectListReducer,
});
