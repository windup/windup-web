import React from "react";
import { Switch, Route } from "react-router-dom";

import { Paths } from "Paths";

import CreateProject from "./create-project";
import AddApplications from "./add-applications";
import SetTransformationPath from "./set-transformation-path";
import SelectPackages from "./select-packages";
import CustomRules from "./custom-rules";
import CustomLabels from "./custom-labels";
import AdvancedOptions from "./advanced-options";
import Review from "./review";

export const NewProject: React.FC = () => {
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};
