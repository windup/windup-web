import React from "react";
import { Switch, Route } from "react-router-dom";
import OrganizationList from "./project-list";
import { NewProject } from "./new-project";
import { Paths } from "../../Paths";

export const Projects: React.FC = () => {
  return (
    <React.Fragment>
      <Switch>
        <Route path={Paths.projects} component={OrganizationList} exact />
        <Route path={Paths.newProject} component={NewProject} exact />
      </Switch>
    </React.Fragment>
  );
};
