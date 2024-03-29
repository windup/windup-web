import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import { Nav, NavItem, PageSidebar } from "@patternfly/react-core";

import { Paths, formatPath } from "Paths";
import { PFTheme, Theme } from "../ThemeUtils";

import { RootState } from "store/rootReducer";
import { projectContextSelectors } from "store/projectContext";

export const SidebarApp: React.FC = () => {
  const selectedProject = useSelector((state: RootState) =>
    projectContextSelectors.selectedProject(state)
  );

  const renderPageNav = () => {
    return (
      <Nav id="nav-primary-simple" aria-label="Nav" theme={PFTheme}>
        <section
          className="pf-c-nav__section"
          aria-labelledby="project-group-menu"
        >
          <ul className="pf-c-nav__list">
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
          </ul>
        </section>
        <section
          className="pf-c-nav__section"
          aria-labelledby="global-group-menu"
          // style={{ marginTop: 0 }}
        >
          <h2 className="pf-c-nav__section-title" id="global-group-menu">
            Global
          </h2>
          <ul className="pf-c-nav__list">
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
          </ul>
        </section>
        <section
          style={{
            padding: 20,
            position: "fixed",
            bottom: 0,
          }}
        >
          <img src={Theme.logoSrc} alt="Logo" style={{ height: 34 }} />
        </section>
      </Nav>
    );
  };

  return <PageSidebar nav={renderPageNav()} theme={PFTheme} />;
};
