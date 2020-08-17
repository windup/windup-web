import * as React from "react";
import Keycloak from "keycloak-js";
import { initInterceptors } from "../../api/apiInit";
import { AppPlaceholder } from "../../components";

interface SecuredComponentProps {}

interface State {
  keycloak: any;
  authenticated: boolean;
}

export class SecuredComponent extends React.Component<
  SecuredComponentProps,
  State
> {
  constructor(props: SecuredComponentProps) {
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
        this.setState({ keycloak: keycloak, authenticated: authenticated });
        initInterceptors(() => keycloak.token);
      })
      .error((err) => {
        console.log(err);
      });
  }

  render() {
    const { authenticated, keycloak } = this.state;
    const { children } = this.props;

    if (authenticated && keycloak) {
      return <React.Fragment>{children}</React.Fragment>;
    }

    return <AppPlaceholder />;
  }
}
