import React, { useEffect } from "react";
import { Project } from "models/api";

interface StateToProps {
  projects: Project[];
}

interface DispatchToProps {
  fetchProjects: () => void;
}

interface ProjectContextProps extends StateToProps, DispatchToProps {
  children: (args: StateToProps) => React.ReactElement;
}

export const ProjectContext: React.FC<ProjectContextProps> = ({
  children,
  projects,
  fetchProjects,
}) => {
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return children({ projects });
};
