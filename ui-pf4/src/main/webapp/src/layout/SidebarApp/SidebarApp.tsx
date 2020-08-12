import React from "react";
import { NavLink } from "react-router-dom";
import { Nav, NavItem, PageSidebar, NavGroup } from "@patternfly/react-core";
import { LayoutTheme } from "../LayoutUtils";

export const SidebarApp: React.FC = () => {
  const renderPageNav = () => {
    return (
      <Nav id="nav-primary-simple" aria-label="Nav" theme={LayoutTheme}>
        <NavGroup title="General">
          <NavItem>
            <NavLink to="/organizations" activeClassName="pf-m-current">
              Organizaciones
            </NavLink>
          </NavItem>
          {/* <NavItem>
            <OrganizationContextNavLink
              to="/server/org/:organizationId/keys"
              activeClassName="pf-m-current"
            >
              Certificados
            </OrganizationContextNavLink>
          </NavItem> */}
        </NavGroup>
        {/* <NavGroup title="Aplicación">
          <NavItem>
            <OrganizationContextNavLink
              to="/server/org/:organizationId/documents"
              activeClassName="pf-m-current"
            >
              Documentos
            </OrganizationContextNavLink>
          </NavItem>
        </NavGroup> */}
      </Nav>
    );
  };

  return <PageSidebar nav={renderPageNav()} theme={LayoutTheme} />;
};
