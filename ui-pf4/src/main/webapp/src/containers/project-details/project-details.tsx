import React, { lazy, Suspense } from "react";
import { Switch, Route, RouteComponentProps } from "react-router-dom";

import { AppPlaceholder } from "components";

import { Paths } from "Paths";
import { ProjectContextPageSectionContainer } from "./projectcontext-pagesection-container";

const ExecutionList = lazy(() => import("./analysis-results/execution-list"));
const ExecutionDetails = lazy(() =>
  import("./analysis-results/execution-details")
);
const ApplicationList = lazy(() => import("./applications/application-list"));
const AddApplications = lazy(() => import("./applications/add-applications"));
const AnalysisConfiguration = lazy(() => import("./analysis-configuration"));

export interface ProjectsDetailsProps
  extends RouteComponentProps<{ project: string }> {}

export const ProjectsDetails: React.FC<ProjectsDetailsProps> = ({
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
          {/* analysis-results */}
          <Route
            path={Paths.editProject_executionList}
            component={ExecutionList}
            exact
          />
          <Route
            path={Paths.editProject_executionDetails}
            component={ExecutionDetails}
          />

          {/* applications */}
          <Route
            path={Paths.editProject_applications}
            component={ApplicationList}
            exact
          />
          <Route
            path={Paths.editProject_add_applications}
            component={AddApplications}
            exact
          />

          {/* analysis-configuration */}
          <Route
            path={Paths.editProject_analysisConfiguration}
            component={AnalysisConfiguration}
          />
        </Switch>
      </Suspense>
    </React.Fragment>
  );
};
