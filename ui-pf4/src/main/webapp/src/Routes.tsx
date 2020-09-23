import React, { lazy, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import { AppPlaceholder } from "./components";
import { Paths } from "./Paths";

const NewProject = lazy(() => import("./containers/new-project"));
const ProjectList = lazy(() => import("./containers/project-list"));
const ProjectDetails = lazy(() => import("./containers/project-details"));

export const AppRoutes = () => {
  const routes = [
    { component: ProjectList, path: Paths.projects, exact: true },
    { component: NewProject, path: Paths.newProject, exact: false },
    { component: ProjectDetails, path: Paths.editProject, exact: false },
  ];

  return (
    <Suspense fallback={<AppPlaceholder />}>
      <Switch>
        {routes.map(({ path, component, ...rest }, index) => (
          <Route key={index} path={path} component={component} {...rest} />
        ))}
        <Redirect from={Paths.base} to={Paths.projects} exact />
      </Switch>
    </Suspense>
  );
};
