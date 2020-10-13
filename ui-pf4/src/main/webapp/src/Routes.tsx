import React, { lazy, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import { AppPlaceholder } from "./components";
import { Paths } from "./Paths";

const Projects = lazy(() => import("./containers/pages/projects"));
const AnalysisResults = lazy(() =>
  import("./containers/pages/analysis-results")
);
const Applications = lazy(() => import("./containers/pages/applications"));
const AnalysisConfiguration = lazy(() =>
  import("./containers/pages/analysis-configuration")
);
const GlobalRules = lazy(() => import("./containers/pages/global-rules"));

export const AppRoutes = () => {
  const routes = [
    { component: Projects, path: Paths.projects, exact: false },
    {
      component: AnalysisResults,
      path: Paths.executions,
      exact: false,
    },
    {
      component: Applications,
      path: Paths.applications,
      exact: false,
    },
    {
      component: AnalysisConfiguration,
      path: Paths.analysisConfiguration,
      exact: false,
    },
    {
      component: GlobalRules,
      path: Paths.globalRules,
      exact: false,
    },
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
