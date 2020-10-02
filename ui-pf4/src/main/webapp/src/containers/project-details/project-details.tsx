import React, { lazy, Suspense } from "react";
import { Switch, Route, RouteComponentProps } from "react-router-dom";

import { AppPlaceholder } from "components";

import { Paths } from "Paths";
import { ProjectContextPageSectionContainer } from "containers/projectcontext-pagesection-container";

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
