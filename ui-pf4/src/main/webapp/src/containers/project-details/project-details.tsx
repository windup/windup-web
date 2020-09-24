import React from "react";
import { Switch, Route, RouteComponentProps } from "react-router-dom";

import { Paths } from "Paths";
import { ProjectDetailsHeader } from "./project-details-header";

import AnalysisResults from "./analysis-results";
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
      <ProjectDetailsHeader
        match={match}
        history={history}
        location={location}
      />
      <Switch>
        <Route
          path={Paths.editProject_analysisResults}
          component={AnalysisResults}
        />
        <Route
          path={Paths.editProject_applications}
          component={Applications}
          exact
        />
      </Switch>
    </React.Fragment>
  );
};
