import React from "react";
import { Switch, Route } from "react-router-dom";
import ProjectList from "./project-list";
import CreateProject from "./new-project/create-project";
import AddApplications from "./new-project/add-applications";
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
      </Switch>
    </React.Fragment>
  );
};
