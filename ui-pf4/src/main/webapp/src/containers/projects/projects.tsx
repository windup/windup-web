import React from "react";
import { Switch, Route } from "react-router-dom";
import ProjectList from "./project-list";
import CreateProject from "./new-project/create-project";
import AddApplications from "./new-project/add-applications";
import SetTransformationPath from "./new-project/set-transformation-path";
import SelectPackages from "./new-project/select-packages";
import CustomRules from "./new-project/custom-rules";
import CustomLabels from "./new-project/custom-labels";
import { Paths } from "../../Paths";

export const Projects: React.FC = () => {
  return (
    <React.Fragment>
      <Switch>
        <Route path={Paths.projects} component={ProjectList} exact />
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
      </Switch>
    </React.Fragment>
  );
};
