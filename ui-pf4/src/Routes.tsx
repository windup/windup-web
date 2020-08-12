import React, { lazy, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import { AppPlaceholder } from "./components";
import { Paths } from "./Paths";

const Projects = lazy(() => import("./containers/projects"));

export const AppRoutes = () => {
  const routes = [{ component: Projects, path: Paths.projects }];

  return (
    <Suspense fallback={<AppPlaceholder />}>
      <Switch>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            component={route.component}
          ></Route>
        ))}
        <Redirect from={Paths.base} to={Paths.projects} exact />
      </Switch>
    </Suspense>
  );
};
