import React, { lazy, Suspense } from "react";
import { Switch, Route, RouteComponentProps, Redirect } from "react-router-dom";

import { AppPlaceholder, PageHeader } from "components";

import { Paths } from "Paths";
import { PageSection } from "@patternfly/react-core";

const SystemProvided = lazy(() => import("./system-provided"));
const UserProvided = lazy(() => import("./user-provided"));

export interface GlobalRulesProps extends RouteComponentProps {}

export const GlobalRules: React.FC<GlobalRulesProps> = () => {
  return (
    <>
      <PageHeader
        applyDefaultTopMargin={true}
        title="Rules configuration"
        navItems={[
          {
            title: "System rules",
            path: Paths.globalRules_systemProvided,
          },
          {
            title: "Custom rules",
            path: Paths.globalRules_userProvided,
          },
        ]}
      />
      <PageSection>
        <Suspense fallback={<AppPlaceholder />}>
          <Switch>
            <Route
              path={Paths.globalRules_systemProvided}
              component={SystemProvided}
            />
            <Route
              path={Paths.globalRules_userProvided}
              component={UserProvided}
            />

            <Redirect
              from={Paths.globalRules}
              to={Paths.globalRules_systemProvided}
              exact
            />
          </Switch>
        </Suspense>
      </PageSection>
    </>
  );
};
