import React from "react";

import { ContextSelector, ContextSelectorItem } from "@patternfly/react-core";
import { Project } from "models/api";

export interface ProjectContextSelectorProps {
  projects: Project[];
  selectedProject?: Project;
  onSelectProject: (project: Project) => void;
}

export const ProjectContextSelector: React.FC<ProjectContextSelectorProps> = ({
  projects,
  selectedProject,
  onSelectProject,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [filteredItems, setFilteredItems] = React.useState<Project[]>(projects);

  React.useEffect(() => {
    setFilteredItems(projects);
  }, [projects]);

  const onSelect = (_: any, value: any) => {
    const selectedProject = projects.find(
      (f) => f.migrationProject.title === value
    );

    setIsOpen((current) => !current);
    onSelectProject(selectedProject!);
  };

  const onToggle = (_: any, isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const onSearchInputChange = (value: string) => {
    setSearchValue(value);
  };

  const onSearchButtonClick = () => {
    const filtered =
      searchValue === ""
        ? projects
        : projects.filter(
            (str) =>
              str.migrationProject.title
                .toLowerCase()
                .indexOf(searchValue.toLowerCase()) !== -1
          );

    setFilteredItems(filtered || []);
  };

  return (
    <ContextSelector
      toggleText={selectedProject?.migrationProject.title}
      onSearchInputChange={onSearchInputChange}
      isOpen={isOpen}
      searchInputValue={searchValue}
      onToggle={onToggle}
      onSelect={onSelect}
      onSearchButtonClick={onSearchButtonClick}
      screenReaderLabel="Selected Project:"
    >
      {filteredItems.map((item, index) => (
        <ContextSelectorItem key={index}>
          {item.migrationProject.title}
        </ContextSelectorItem>
      ))}
    </ContextSelector>
  );
};
