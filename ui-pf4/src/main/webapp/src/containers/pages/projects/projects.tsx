import React, { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";

import { AppPlaceholder } from "components";

import { Paths } from "Paths";

const ProjectList = lazy(() => import("./project-list"));
const NewProject = lazy(() => import("./new-project"));

export const Projects: React.FC = () => {
  return (
    <>
      <Suspense fallback={<AppPlaceholder />}>
        <Switch>
          <Route path={Paths.projects} component={ProjectList} exact />
          <Route path={Paths.newProject} component={NewProject} />
        </Switch>
      </Suspense>
    </>
  );
};
