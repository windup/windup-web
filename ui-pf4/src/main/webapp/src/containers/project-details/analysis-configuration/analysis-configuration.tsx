import React, { lazy, Suspense } from "react";
import { Switch, Route, RouteComponentProps, Redirect } from "react-router-dom";

import { PageSection } from "@patternfly/react-core";

import { Paths, formatPath } from "Paths";

import { PageHeader, AppPlaceholder } from "components";

const General = lazy(() => import("./general"));
const Packages = lazy(() => import("./packages"));

export interface AnalysisConfigurationProps
  extends RouteComponentProps<{ project: string }> {}

export const AnalysisConfiguration: React.FC<AnalysisConfigurationProps> = ({
  match,
}) => {
  return (
    <React.Fragment>
      <PageHeader
        title="Analysis configuration"
        navItems={[
          {
            title: "General",
            path: formatPath(Paths.editProject_analysisConfiguration_general, {
              project: match.params.project,
            }),
          },
          {
            title: "Packages",
            path: formatPath(Paths.editProject_analysisConfiguration_packages, {
              project: match.params.project,
            }),
          },
          {
            title: "Custom rules",
            path: formatPath(
              Paths.editProject_analysisConfiguration_customRules,
              {
                project: match.params.project,
              }
            ),
          },
          {
            title: "Custom labels",
            path: formatPath(
              Paths.editProject_analysisConfiguration_customLabels,
              {
                project: match.params.project,
              }
            ),
          },
          {
            title: "Advanced options",
            path: formatPath(
              Paths.editProject_analysisConfiguration_advancedOptions,
              {
                project: match.params.project,
              }
            ),
          },
        ]}
      />
      <PageSection>
        <Suspense fallback={<AppPlaceholder />}>
          <Switch>
            <Route
              path={Paths.editProject_analysisConfiguration_general}
              component={General}
            />
            <Route
              path={Paths.editProject_analysisConfiguration_packages}
              component={Packages}
            />
            <Redirect
              from={formatPath(Paths.editProject_analysisConfiguration, {
                project: match.params.project,
              })}
              to={formatPath(Paths.editProject_analysisConfiguration_general, {
                project: match.params.project,
              })}
              exact
            />
          </Switch>
        </Suspense>
      </PageSection>
    </React.Fragment>
  );
};
