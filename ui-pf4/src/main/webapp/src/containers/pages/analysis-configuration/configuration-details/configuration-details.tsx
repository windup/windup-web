import React, { lazy, Suspense } from "react";
import { Switch, Route, RouteComponentProps, Redirect } from "react-router-dom";

import { PageSection } from "@patternfly/react-core";

import { Paths, formatPath } from "Paths";

import { PageHeader, AppPlaceholder } from "components";

const General = lazy(() => import("./general"));
const Packages = lazy(() => import("./packages"));
const Rules = lazy(() => import("./rules"));
const Labels = lazy(() => import("./labels"));

export interface ConfigurationDetailsProps
  extends RouteComponentProps<{ project: string }> {}

export const ConfigurationDetails: React.FC<ConfigurationDetailsProps> = ({
  match,
}) => {
  return (
    <>
      <PageHeader
        title="Analysis configuration"
        navItems={[
          {
            title: "General",
            path: formatPath(Paths.analysisConfiguration_general, {
              project: match.params.project,
            }),
          },
          {
            title: "Packages",
            path: formatPath(Paths.analysisConfiguration_packages, {
              project: match.params.project,
            }),
          },
          {
            title: "Custom rules",
            path: formatPath(Paths.analysisConfiguration_customRules, {
              project: match.params.project,
            }),
          },
          {
            title: "Custom labels",
            path: formatPath(Paths.analysisConfiguration_customLabels, {
              project: match.params.project,
            }),
          },
          {
            title: "Advanced options",
            path: formatPath(Paths.analysisConfiguration_advancedOptions, {
              project: match.params.project,
            }),
          },
        ]}
      />
      <PageSection>
        <Suspense fallback={<AppPlaceholder />}>
          <Switch>
            <Route
              path={Paths.analysisConfiguration_general}
              component={General}
            />
            <Route
              path={Paths.analysisConfiguration_packages}
              component={Packages}
            />
            <Route
              path={Paths.analysisConfiguration_customRules}
              component={Rules}
            />
            <Route
              path={Paths.analysisConfiguration_customLabels}
              component={Labels}
            />

            <Redirect
              from={formatPath(Paths.analysisConfiguration, {
                project: match.params.project,
              })}
              to={formatPath(Paths.analysisConfiguration_general, {
                project: match.params.project,
              })}
              exact
            />
          </Switch>
        </Suspense>
      </PageSection>
    </>
  );
};
