import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { FormGroup } from "@patternfly/react-core";

import "./projectcontext-pagesection-container.scss";

import { ProjectContextSelector, ProjectContextPageSection } from "components";

import { Project } from "models/api";

import { RootState } from "store/rootReducer";
import {
  projectContextSelectors,
  projectContextActions,
} from "store/projectContext";

export interface IProjectContextPageSectionContainerProps {
  projectIdRouteParam: string;
  onProjectContextChange: (project: Project) => void;
}

export const ProjectContextPageSectionContainer: React.FC<IProjectContextPageSectionContainerProps> = ({
  projectIdRouteParam,
  onProjectContextChange,
}) => {
  const dispatch = useDispatch();

  const projects = useSelector((state: RootState) =>
    projectContextSelectors.projects(state)
  );
  const selectedProject = useSelector((state: RootState) =>
    projectContextSelectors.selectedProject(state)
  );

  useEffect(() => {
    const newSelectedProject = projects.find(
      (f) => f.migrationProject.id.toString() === projectIdRouteParam
    );
    if (newSelectedProject) {
      dispatch(projectContextActions.selectProjectContext(newSelectedProject));
    }
  }, [projectIdRouteParam, projects, dispatch]);

  useEffect(() => {
    dispatch(projectContextActions.fetchProjectsContext());
  }, [dispatch]);

  return (
    <ProjectContextPageSection>
      <div className="pf-c-form pf-m-horizontal pf-c-form_projectcontext-pagesection-container">
        <FormGroup label="Project:" fieldId="project">
          <ProjectContextSelector
            projects={projects}
            selectedProject={selectedProject}
            onSelectProject={onProjectContextChange}
          />
        </FormGroup>
      </div>
    </ProjectContextPageSection>
  );
};
