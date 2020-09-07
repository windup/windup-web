import React from "react";
import { HashRouter } from "react-router-dom";
import { AppRoutes } from "./Routes";

import "./App.scss";

import { KeycloakWrapper } from "./keycloak/KeycloakWrapper";
import { DefaultLayout } from "./layout";
import { DeleteDialog } from "./containers";

import "@redhat-cloud-services/frontend-components-notifications/index.css";
const frontendComponentsNotifications = require("@redhat-cloud-services/frontend-components-notifications");

const App: React.FC = () => {
  const NotificationsPortal =
    frontendComponentsNotifications.NotificationsPortal;
  return (
    <React.Fragment>
      <KeycloakWrapper>
        <HashRouter>
          <DefaultLayout>
            <AppRoutes />
          </DefaultLayout>
          <NotificationsPortal />
          <DeleteDialog />
        </HashRouter>
      </KeycloakWrapper>
    </React.Fragment>
  );
};

export default App;
