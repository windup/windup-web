import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { Provider } from "react-redux";
import configureStore from "./store";
import { initApi, initInterceptors } from "./api/apiInit";

import { AppPlaceholder } from "components";

import { isSSOEnabled } from "Constants";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak";

initApi();

export const ReactKeycloakProviderWrapper: React.FC = ({ children }) => {
  return isSSOEnabled() ? (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{ onLoad: "login-required" }}
      LoadingComponent={<AppPlaceholder />}
      isLoadingCheck={(keycloak) => {
        if (keycloak.authenticated) {
          initInterceptors(() => {
            return new Promise<string>((resolve, reject) => {
              if (keycloak.token) {
                keycloak
                  .updateToken(5)
                  .then(() => resolve(keycloak.token!))
                  .catch(() => reject("Failed to refresh token"));
              } else {
                keycloak.login();
                reject("Not logged in");
              }
            });
          });
        }

        return !keycloak.authenticated;
      }}
    >
      {children}
    </ReactKeycloakProvider>
  ) : (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{ onLoad: "login-required" }}
    >
      {children}
    </ReactKeycloakProvider>
  );
};
ReactDOM.render(
  <React.StrictMode>
    <ReactKeycloakProviderWrapper>
      <Provider store={configureStore()}>
        <App />
      </Provider>
    </ReactKeycloakProviderWrapper>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
