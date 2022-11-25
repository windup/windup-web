import React from "react";
import Keycloak from "keycloak-js";
import { initInterceptors } from "../api/apiInit";
import { AppPlaceholder } from "../components";

interface KeycloakWrapperProps {}

interface State {
  keycloak: any;
  authenticated: boolean;
}

export class KeycloakWrapper extends React.Component<
  KeycloakWrapperProps,
  State
> {
  constructor(props: KeycloakWrapperProps) {
    super(props);
    this.state = {
      keycloak: undefined,
      authenticated: false,
    };
  }

  componentDidMount() {
    const keycloak = Keycloak(process.env.PUBLIC_URL + "/keycloak.json");
    keycloak
      .init({ onLoad: "login-required" })
      .success((authenticated) => {
        initInterceptors(() => {
          return new Promise<string>((resolve, reject) => {
            if (keycloak.token) {
              keycloak.updateToken(5)
                .then(() => resolve(keycloak.token!))
                .catch(() => reject("Failed to refresh token"));
            } else {
              keycloak.login();
              reject("Not logged in");
            }
          });
        });

        this.setState({ keycloak: keycloak, authenticated: authenticated });
      })
      .error((err) => {
        console.log(err);
      });
  }

  render() {
    const { authenticated, keycloak } = this.state;
    const { children } = this.props;

    if (authenticated && keycloak) {
      return <>{children}</>;
    }

    return <AppPlaceholder />;
  }
}
