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
              to={formatPath(Paths.executions, {
                project: selectedProject?.migrationProject.id,
              })}
              activeClassName="pf-m-current"
            >
              Analysis results
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to={formatPath(Paths.applications, {
                project: selectedProject?.migrationProject.id,
              })}
              activeClassName="pf-m-current"
            >
              Applications
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to={formatPath(Paths.analysisConfiguration, {
                project: selectedProject?.migrationProject.id,
              })}
              activeClassName="pf-m-current"
            >
              Analysis configuration
            </NavLink>
          </NavItem>
        </NavList>
        <NavList style={{ paddingTop: 20 }}>
          <NavItem>
            <NavLink to={Paths.globalRules} activeClassName="pf-m-current">
              Rules configuration
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to={Paths.globalLabels} activeClassName="pf-m-current">
              Labels configuration
            </NavLink>
          </NavItem>
        </NavList>
      </Nav>
    );
  };

  return <PageSidebar nav={renderPageNav()} theme={LayoutTheme} />;
};
