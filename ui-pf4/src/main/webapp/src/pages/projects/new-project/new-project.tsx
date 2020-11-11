import React, { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";

import { Paths } from "Paths";
import { AppPlaceholder, SimplePageSection } from "components";
import { PageSection } from "@patternfly/react-core";

const CreateProject = lazy(() => import("./create-project"));
const AddApplications = lazy(() => import("./add-applications"));
const SetTransformationPath = lazy(() => import("./set-transformation-path"));
const SelectPackages = lazy(() => import("./select-packages"));
const SetCustomRules = lazy(() => import("./set-custom-rules"));
const SetCustomLabels = lazy(() => import("./set-custom-labels"));
const SetAdvancedOptions = lazy(() => import("./set-advanced-options"));
const Review = lazy(() => import("./review"));

export const NewProject: React.FC = () => {
  return (
    <>
      <SimplePageSection
        title="Create project"
        description="Create a project for your applications."
      />
      <PageSection style={{ padding: "1px 0 0 0" }}>
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
              component={SetCustomRules}
              exact
            />
            <Route
              path={Paths.newProject_customLabels}
              component={SetCustomLabels}
              exact
            />
            <Route
              path={Paths.newProject_advandedOptions}
              component={SetAdvancedOptions}
              exact
            />
            <Route path={Paths.newProject_review} component={Review} exact />
          </Switch>
        </Suspense>
      </PageSection>
    </>
  );
};
