import React, { lazy, Suspense } from "react";
import { Switch, Route, RouteComponentProps } from "react-router-dom";

import { AppPlaceholder } from "components";

import { formatPath, Paths } from "Paths";
import { Project } from "models/api";

import { ProjectContextPageSectionContainer } from "containers/projectcontext-pagesection-container";

const ConfigurationDetails = lazy(() => import("./configuration-details"));

export interface AnalysisConfigurationProps
  extends RouteComponentProps<{ project: string }> {}

export const AnalysisConfiguration: React.FC<AnalysisConfigurationProps> = ({
  match,
  history: { push },
}) => {
  const handleOnSelectProject = (project: Project) => {
    push(
      formatPath(Paths.analysisConfiguration_general, {
        project: project.migrationProject.id,
      })
    );
  };

  return (
    <React.Fragment>
      <ProjectContextPageSectionContainer
        projectIdRouteParam={match.params.project}
        onProjectContextChange={handleOnSelectProject}
      />
      <Suspense fallback={<AppPlaceholder />}>
        <Switch>
          <Route
            path={Paths.analysisConfiguration}
            component={ConfigurationDetails}
          />
        </Switch>
      </Suspense>
    </React.Fragment>
  );
};
