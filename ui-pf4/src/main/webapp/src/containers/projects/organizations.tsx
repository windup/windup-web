import React from "react";
import { Switch, Route } from "react-router-dom";
import OrganizationList from "./organization-list";
import { PageCreateOrganization } from "./new-organization";
import { Paths } from "../../Paths";

export const Organizations: React.FC = () => {
  return (
    <React.Fragment>
      <Switch>
        <Route path={Paths.projects} component={OrganizationList} exact />
        <Route
          path={Paths.newProject}
          component={PageCreateOrganization}
          exact
        />
      </Switch>
    </React.Fragment>
  );
};
