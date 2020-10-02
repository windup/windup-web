import React, { lazy, Suspense } from "react";
import { Switch, Route, RouteComponentProps } from "react-router-dom";

import { AppPlaceholder } from "components";

import { formatPath, Paths } from "Paths";
import { Project } from "models/api";

import { ProjectContextPageSectionContainer } from "containers/projectcontext-pagesection-container";

const ExecutionList = lazy(() => import("./execution-list"));
const ExecutionDetails = lazy(() => import("./execution-details"));

export interface AnalysisResultsProps
  extends RouteComponentProps<{ project: string }> {}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  match,
  history: { push },
}) => {
  const handleOnSelectProject = (project: Project) => {
    push(
      formatPath(Paths.executions, {
        project: project.migrationProject.id,
      })
    );
  };

  return (
    <React.Fragment>
      <ProjectContextPageSectionContainer
        projectIdRouteParam={match.params.project}
        onProjectContextChange={handleOnSelectProject}
      />
      <Suspense fallback={<AppPlaceholder />}>
        <Switch>
          <Route path={Paths.executions} component={ExecutionList} exact />
          <Route path={Paths.editExecution} component={ExecutionDetails} />
        </Switch>
      </Suspense>
    </React.Fragment>
  );
};
