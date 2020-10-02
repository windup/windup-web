import React, { lazy, Suspense } from "react";
import { Switch, Route, RouteComponentProps } from "react-router-dom";

import { AppPlaceholder } from "components";

import { Paths } from "Paths";

const ProjectList = lazy(() => import("./project-list"));
const NewProject = lazy(() => import("./new-project"));

export interface ProjectsProps
  extends RouteComponentProps<{ project: string }> {}

export const Projects: React.FC<ProjectsProps> = () => {
  return (
    <React.Fragment>
      <Suspense fallback={<AppPlaceholder />}>
        <Switch>
          <Route path={Paths.projects} component={ProjectList} exact />
          <Route path={Paths.newProject} component={NewProject} />
        </Switch>
      </Suspense>
    </React.Fragment>
  );
};
