import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { Form, FormGroup } from "@patternfly/react-core";

import "./projectcontext-pagesection-container.scss";

import { Paths, formatPath } from "Paths";
import { ProjectContextSelector, ProjectContextPageSection } from "components";

import { Project } from "models/api";

import { RootState } from "store/rootReducer";
import {
  projectContextSelectors,
  projectContextActions,
} from "store/projectContext";

export interface ProjectContextPageSectionContainer
  extends RouteComponentProps<{ project: string }> {}

export const ProjectContextPageSectionContainer: React.FC<ProjectContextPageSectionContainer> = ({
  match,
  history: { push },
}) => {
  const dispatch = useDispatch();

  const projects = useSelector((state: RootState) =>
    projectContextSelectors.projects(state)
  );
  const selectedProject = useSelector((state: RootState) =>
    projectContextSelectors.selectedProject(state)
  );

  React.useEffect(() => {
    const newSelectedProject = projects.find(
      (f) => f.migrationProject.id.toString() === match.params.project
    );
    if (newSelectedProject) {
      dispatch(projectContextActions.selectProjectContext(newSelectedProject));
    }
  }, [match, projects, dispatch]);

  React.useEffect(() => {
    dispatch(projectContextActions.fetchProjectsContext());
  }, [dispatch]);

  const handleOnSelectProject = (project: Project) => {
    push(
      formatPath(Paths.editProject_executionList, {
        project: project.migrationProject.id,
      })
    );
  };

  return (
    <ProjectContextPageSection>
      <Form
        isHorizontal
        className="pf-c-form_projectcontext-pagesection-container"
      >
        <FormGroup label="Project:" fieldId="project">
          <ProjectContextSelector
            projects={projects}
            selectedProject={selectedProject}
            onSelectProject={handleOnSelectProject}
          />
        </FormGroup>
      </Form>
    </ProjectContextPageSection>
  );
};
