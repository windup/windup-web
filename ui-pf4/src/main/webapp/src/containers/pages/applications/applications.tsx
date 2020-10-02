import React, { lazy, Suspense } from "react";
import { Switch, Route, RouteComponentProps } from "react-router-dom";

import { AppPlaceholder } from "components";

import { Paths } from "Paths";
import { ProjectContextPageSectionContainer } from "containers/projectcontext-pagesection-container";

const ApplicationList = lazy(() => import("./application-list"));
const AddApplications = lazy(() => import("./add-applications"));

export interface ApplicationsProps
  extends RouteComponentProps<{ project: string }> {}

export const Applications: React.FC<ApplicationsProps> = ({
  match,
  history,
  location,
}) => {
  return (
    <React.Fragment>
      <ProjectContextPageSectionContainer
        match={match}
        history={history}
        location={location}
      />
      <Suspense fallback={<AppPlaceholder />}>
        <Switch>
          <Route
            path={Paths.editProject_applications}
            component={ApplicationList}
            exact
          />
          <Route
            path={Paths.editProject_add_applications}
            component={AddApplications}
          />
        </Switch>
      </Suspense>
    </React.Fragment>
  );
};
