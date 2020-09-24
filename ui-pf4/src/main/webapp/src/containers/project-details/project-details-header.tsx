import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

import { Form, FormGroup } from "@patternfly/react-core";

import "./project-details-header.scss";

import { Paths, formatPath } from "Paths";
import { ProjectContextSelector, ProjectContextPageSection } from "components";

import { Project } from "models/api";

import { RootState } from "store/rootReducer";
import {
  projectContextSelectors,
  projectContextActions,
} from "store/projectContext";

export interface ProjectDetailsHeaderProps
  extends RouteComponentProps<{ project: string }> {}

export const ProjectDetailsHeader: React.FC<ProjectDetailsHeaderProps> = ({
  match,
  history: { push },
}) => {
  const dispatch = useDispatch();

  const projects = useSelector(
    (state: RootState) => projectContextSelectors.projects(state),
    shallowEqual
  );
  const selectedProject = useSelector(
    (state: RootState) => projectContextSelectors.selectedProject(state),
    shallowEqual
  );

  React.useEffect(() => {
    const newSelectedProject = projects.find(
      (f) => f.migrationProject.id.toString() === match.params.project
    );
    if (newSelectedProject) {
      dispatch(projectContextActions.selectProjectContext(newSelectedProject));
    }
  }, [match, projects, dispatch]);

  const handleOnSelectProject = (project: Project) => {
    push(
      formatPath(Paths.editProject_executionList, {
        project: project.migrationProject.id,
      })
    );
  };

  return (
    <ProjectContextPageSection>
      <Form isHorizontal className="pf-c-form_project-details-header">
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
