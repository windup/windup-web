import React from "react";
import { Switch, Route, RouteComponentProps } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { PageSection } from "@patternfly/react-core";

import { Paths } from "Paths";
import { ProjectContextSelector } from "components";

import { Project } from "models/api";

import { RootState } from "store/rootReducer";
import {
  projectContextSelectors,
  projectContextActions,
} from "store/projectContext";

import AnalysisResults from "./analysis-results";
import Applications from "./applications";

export interface ProjectsDetailsProps
  extends RouteComponentProps<{ project: string }> {}

export const ProjectsDetails: React.FC<ProjectsDetailsProps> = ({ match }) => {
  const projects = useSelector((state: RootState) =>
    projectContextSelectors.projects(state)
  );
  const selectedProject = useSelector((state: RootState) =>
    projectContextSelectors.selectedProject(state)
  );

  const dispatch = useDispatch();
  const onSelectProject = (project: Project) => {
    dispatch(projectContextActions.selectProjectContext(project));
  };

  React.useEffect(() => {
    const newSelectedProject = projects.find(
      (f) => f.migrationProject.id.toString() === match.params.project
    );
    if (newSelectedProject) {
      dispatch(projectContextActions.selectProjectContext(newSelectedProject));
    }
  }, [match, projects, selectedProject, dispatch]);

  return (
    <React.Fragment>
      <PageSection variant="light">
        <ProjectContextSelector
          projects={projects}
          selectedProject={selectedProject}
          onSelectProject={onSelectProject}
        />
      </PageSection>
      <PageSection>
        <Switch>
          <Route
            path={Paths.editProject_analysisResults}
            component={AnalysisResults}
            exact
          />
          <Route
            path={Paths.editProject_applications}
            component={Applications}
            exact
          />
        </Switch>
      </PageSection>
    </React.Fragment>
  );
};
