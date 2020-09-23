import React from "react";
import { HashRouter } from "react-router-dom";
import { AppRoutes } from "./Routes";

import "./App.scss";

import { KeycloakWrapper } from "./keycloak/KeycloakWrapper";
import { DefaultLayout } from "./layout";

import { DeleteDialog, ProjectContext } from "./containers";

import "@redhat-cloud-services/frontend-components-notifications/index.css";
const frontendComponentsNotifications = require("@redhat-cloud-services/frontend-components-notifications");

const App: React.FC = () => {
  const NotificationsPortal =
    frontendComponentsNotifications.NotificationsPortal;

  return (
    <KeycloakWrapper>
      {/* ProjectContext Fetches the list of Projects for the first time*/}
      <ProjectContext>
        {() => (
          <HashRouter>
            <DefaultLayout>
              <AppRoutes />
            </DefaultLayout>
            <NotificationsPortal />
            <DeleteDialog />
          </HashRouter>
        )}
      </ProjectContext>
    </KeycloakWrapper>
  );
};

export default App;
