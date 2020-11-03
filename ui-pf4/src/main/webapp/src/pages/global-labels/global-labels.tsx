import React, { lazy, Suspense } from "react";
import { Switch, Route, RouteComponentProps, Redirect } from "react-router-dom";

import { AppPlaceholder, PageHeader } from "components";

import { Paths } from "Paths";
import { PageSection } from "@patternfly/react-core";

const SystemProvided = lazy(() => import("./system-provided"));
const UserProvided = lazy(() => import("./user-provided"));

export interface GlobalLabelsProps extends RouteComponentProps {}

export const GlobalLabels: React.FC<GlobalLabelsProps> = () => {
  return (
    <>
      <PageHeader
        applyDefaultTopMargin={true}
        title="Labels configuration"
        navItems={[
          {
            title: "System labels",
            path: Paths.globalLabels_systemProvided,
          },
          {
            title: "Custom labels",
            path: Paths.globalLabels_userProvided,
          },
        ]}
      />
      <PageSection>
        <Suspense fallback={<AppPlaceholder />}>
          <Switch>
            <Route
              path={Paths.globalLabels_systemProvided}
              component={SystemProvided}
            />
            <Route
              path={Paths.globalLabels_userProvided}
              component={UserProvided}
            />

            <Redirect
              from={Paths.globalLabels}
              to={Paths.globalLabels_systemProvided}
              exact
            />
          </Switch>
        </Suspense>
      </PageSection>
    </>
  );
};
