import React from "react";
import { NavLink } from "react-router-dom";
import { Nav, NavItem, PageSidebar, NavList } from "@patternfly/react-core";
import { LayoutTheme } from "../LayoutUtils";
import { Paths } from "../../Paths";

export const SidebarApp: React.FC = () => {
  const renderPageNav = () => {
    return (
      <Nav id="nav-primary-simple" aria-label="Nav" theme={LayoutTheme}>
        <NavList>
          <NavItem>
            <NavLink to={Paths.projects} activeClassName="pf-m-current">
              Projects
            </NavLink>
          </NavItem>
          <NavItem>Analysis results</NavItem>
          <NavItem>Applications</NavItem>
          <NavItem>Analysis configuration</NavItem>
        </NavList>
      </Nav>
    );
  };

  return <PageSidebar nav={renderPageNav()} theme={LayoutTheme} />;
};
