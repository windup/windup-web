import React from "react";
import { Switch, Route, RouteComponentProps } from "react-router-dom";

import { Paths } from "Paths";
import { ProjectContextPageSectionContainer } from "./projectcontext-pagesection-container";

import ExecutionList from "./analysis-results/execution-list";
import ExecutionDetails from "./analysis-results/execution-details";

import Applications from "./applications";

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
          component={Applications}
          exact
        />
      </Switch>
    </React.Fragment>
  );
};
