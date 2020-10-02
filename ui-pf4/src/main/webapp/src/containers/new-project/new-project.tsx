import React, { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";

import { Paths } from "Paths";
import { AppPlaceholder } from "components";

const CreateProject = lazy(() => import("./create-project"));
const AddApplications = lazy(() => import("./add-applications"));
const SetTransformationPath = lazy(() => import("./set-transformation-path"));
const SelectPackages = lazy(() => import("./select-packages"));
const CustomRules = lazy(() => import("./custom-rules"));
const CustomLabels = lazy(() => import("./custom-labels"));
const AdvancedOptions = lazy(() => import("./advanced-options"));
const Review = lazy(() => import("./review"));

export const NewProject: React.FC = () => {
  return (
    <React.Fragment>
      <Suspense fallback={<AppPlaceholder />}>
        <Switch>
          <Route path={Paths.newProject} component={CreateProject} exact />
          <Route
            path={Paths.newProject_details}
            component={CreateProject}
            exact
          />
          <Route
            path={Paths.newProject_addApplications}
            component={AddApplications}
            exact
          />
          <Route
            path={Paths.newProject_setTransformationPath}
            component={SetTransformationPath}
            exact
          />
          <Route
            path={Paths.newProject_selectPackages}
            component={SelectPackages}
            exact
          />
          <Route
            path={Paths.newProject_customRules}
            component={CustomRules}
            exact
          />
          <Route
            path={Paths.newProject_customLabels}
            component={CustomLabels}
            exact
          />
          <Route
            path={Paths.newProject_advandedOptions}
            component={AdvancedOptions}
            exact
          />
          <Route path={Paths.newProject_review} component={Review} exact />
        </Switch>
      </Suspense>
    </React.Fragment>
  );
};
