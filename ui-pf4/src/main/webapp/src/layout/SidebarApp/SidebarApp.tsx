import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import { Nav, NavItem, PageSidebar, NavList } from "@patternfly/react-core";

import { LayoutTheme } from "../LayoutUtils";
import { Paths, formatPath } from "Paths";

import { RootState } from "store/rootReducer";
import { projectContextSelectors } from "store/projectContext";

export const SidebarApp: React.FC = () => {
  const selectedProject = useSelector((state: RootState) =>
    projectContextSelectors.selectedProject(state)
  );

  const renderPageNav = () => {
    return (
      <Nav id="nav-primary-simple" aria-label="Nav" theme={LayoutTheme}>
        <NavList>
          <NavItem>
            <NavLink to={Paths.projects} activeClassName="pf-m-current">
              Projects
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to={formatPath(Paths.editProject_executionList, {
                project: selectedProject?.migrationProject.id,
              })}
              activeClassName="pf-m-current"
            >
              Analysis results
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to={formatPath(Paths.editProject_applications, {
                project: selectedProject?.migrationProject.id,
              })}
              activeClassName="pf-m-current"
            >
              Applications
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to={formatPath(Paths.editProject_analysisConfiguration, {
                project: selectedProject?.migrationProject.id,
              })}
              activeClassName="pf-m-current"
            >
              Analysis configuration
            </NavLink>
          </NavItem>
        </NavList>
      </Nav>
    );
  };

  return <PageSidebar nav={renderPageNav()} theme={LayoutTheme} />;
};
