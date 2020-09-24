import React from "react";
import { Switch, Route } from "react-router-dom";

import { Paths } from "Paths";

import ExecutionList from "./execution-list";
import ExecutionDetails from "./execution-details";

export const AnalysisResults: React.FC = () => {
  return (
    <React.Fragment>
      <Switch>
        <Route
          path={Paths.editProject_executionList}
          component={ExecutionList}
          exact
        />
        <Route
          path={Paths.editProject_executionDetails}
          component={ExecutionDetails}
        />
      </Switch>
    </React.Fragment>
  );
};
