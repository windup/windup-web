import React, { lazy, Suspense } from "react";
import { Switch, Route, RouteComponentProps } from "react-router-dom";

import { AppPlaceholder } from "components";

import { formatPath, Paths } from "Paths";
import { Project } from "models/api";

import { ProjectContextPageSectionContainer } from "containers/projectcontext-pagesection-container";

const ApplicationList = lazy(() => import("./application-list"));
const AddApplications = lazy(() => import("./add-applications"));

export interface ApplicationsProps
  extends RouteComponentProps<{ project: string }> {}

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
    <React.Fragment>
      <ProjectContextPageSectionContainer
        projectIdRouteParam={match.params.project}
        onProjectContextChange={handleOnSelectProject}
      />
      <Suspense fallback={<AppPlaceholder />}>
        <Switch>
          <Route path={Paths.applications} component={ApplicationList} exact />
          <Route path={Paths.addApplications} component={AddApplications} />
        </Switch>
      </Suspense>
    </React.Fragment>
  );
};
