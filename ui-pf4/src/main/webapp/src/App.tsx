import React from "react";
import { HashRouter } from "react-router-dom";

import { AppRoutes } from "./Routes";

import "./App.scss";

import { DefaultLayout } from "./layout";

import DeleteDialog from "./containers/delete-dialog";
import { RuleLabelDetailsModal } from "./containers/rule-label-details-modal";

import "@redhat-cloud-services/frontend-components-notifications/index.css";
const frontendComponentsNotifications = require("@redhat-cloud-services/frontend-components-notifications");

const App: React.FC = () => {
  const NotificationsPortal =
    frontendComponentsNotifications.NotificationsPortal;

  return (
    <HashRouter>
      <DefaultLayout>
        <AppRoutes />
      </DefaultLayout>
      <NotificationsPortal />
      <DeleteDialog />
      <RuleLabelDetailsModal />
    </HashRouter>
  );
};

export default App;
