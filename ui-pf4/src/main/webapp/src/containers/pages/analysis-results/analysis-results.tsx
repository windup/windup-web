import React, { lazy, Suspense } from "react";
import { Switch, Route, RouteComponentProps } from "react-router-dom";

import { AppPlaceholder } from "components";

import { Paths } from "Paths";
import { ProjectContextPageSectionContainer } from "containers/projectcontext-pagesection-container";

const ExecutionList = lazy(() => import("./execution-list"));
const ExecutionDetails = lazy(() => import("./execution-details"));

export interface AnalysisResultsProps
  extends RouteComponentProps<{ project: string }> {}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
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
            path={Paths.editProject_executionList}
            component={ExecutionList}
            exact
          />
          <Route
            path={Paths.editProject_executionDetails}
            component={ExecutionDetails}
          />
        </Switch>
      </Suspense>
    </React.Fragment>
  );
};
