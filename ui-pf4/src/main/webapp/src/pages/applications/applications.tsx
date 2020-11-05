import React, { lazy, Suspense } from "react";
import { Switch, Route, RouteComponentProps } from "react-router-dom";

import { AppPlaceholder } from "components";

import { formatPath, Paths, ProjectRoute } from "Paths";
import { Project } from "models/api";

import { ProjectContextPageSectionContainer } from "containers/projectcontext-pagesection-container";

const ApplicationList = lazy(() => import("./application-list"));

export interface ApplicationsProps extends RouteComponentProps<ProjectRoute> {}

export const Applications: React.FC<ApplicationsProps> = ({
  match,
  history: { push },
}) => {
  const handleOnSelectProject = (project: Project) => {
    push(
      formatPath(Paths.applications, {
        project: project.migrationProject.id,
      })
    );
  };

  return (
    <>
      <ProjectContextPageSectionContainer
        projectIdRouteParam={match.params.project}
        onProjectContextChange={handleOnSelectProject}
      />
      <Suspense fallback={<AppPlaceholder />}>
        <Switch>
          <Route path={Paths.applications} component={ApplicationList} exact />
        </Switch>
      </Suspense>
    </>
  );
};
