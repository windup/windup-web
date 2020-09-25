import React from "react";
import { HashRouter } from "react-router-dom";
import { useDispatch } from "react-redux";

import { AppRoutes } from "./Routes";

import "./App.scss";

import { DefaultLayout } from "./layout";

import { DeleteDialog } from "./containers";

import "@redhat-cloud-services/frontend-components-notifications/index.css";
import { projectContextActions } from "store/projectContext";
const frontendComponentsNotifications = require("@redhat-cloud-services/frontend-components-notifications");

const App: React.FC = () => {
  const NotificationsPortal =
    frontendComponentsNotifications.NotificationsPortal;

  // Fetch context projects for the first time
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(projectContextActions.fetchProjectsContext());
  }, [dispatch]);

  return (
    <HashRouter>
      <DefaultLayout>
        <AppRoutes />
      </DefaultLayout>
      <NotificationsPortal />
      <DeleteDialog />
    </HashRouter>
  );
};

export default App;
