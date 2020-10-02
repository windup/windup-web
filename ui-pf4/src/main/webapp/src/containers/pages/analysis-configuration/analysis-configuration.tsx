import React, { lazy, Suspense } from "react";
import { Switch, Route, RouteComponentProps } from "react-router-dom";

import { AppPlaceholder } from "components";

import { Paths } from "Paths";
import { ProjectContextPageSectionContainer } from "containers/projectcontext-pagesection-container";

const ConfigurationDetails = lazy(() => import("./configuration-details"));

export interface AnalysisConfigurationProps
  extends RouteComponentProps<{ project: string }> {}

export const AnalysisConfiguration: React.FC<AnalysisConfigurationProps> = ({
  match,
  history,
  location,
}) => {
  return (
    <React.Fragment>
      <ProjectContextPageSectionContainer
        match={match}
        history={history}
        location={location}
      />
      <Suspense fallback={<AppPlaceholder />}>
        <Switch>
          <Route
            path={Paths.editProject_analysisConfiguration}
            component={ConfigurationDetails}
          />
        </Switch>
      </Suspense>
    </React.Fragment>
  );
};
