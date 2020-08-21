import React from "react";
import { Switch, Route } from "react-router-dom";
import ProjectList from "./project-list";
import NewProject from "./new-project";
import NewProjectCompletition from "./new-project-completition";
import { Paths } from "../../Paths";

export const Projects: React.FC = () => {
  return (
    <React.Fragment>
      <Switch>
        <Route path={Paths.projects} component={ProjectList} exact />
        <Route path={Paths.newProject} component={NewProject} exact />
        <Route
          path={Paths.newProject_completition}
          component={NewProjectCompletition}
          exact
        />
      </Switch>
    </React.Fragment>
  );
};
