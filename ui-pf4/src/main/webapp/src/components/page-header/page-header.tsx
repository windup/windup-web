import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import {
  PageSection,
  PageSectionVariants,
  TextContent,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  Split,
  SplitItem,
  Label,
  Stack,
  StackItem,
  Dropdown,
  DropdownToggle,
  DropdownItem,
} from "@patternfly/react-core";

import { CaretDownIcon } from "@patternfly/react-icons";

export interface PageHeaderProps {
  title: string;
  kindAbbr?: string;
  breadcrumbs?: { title: string; path: string }[];
  menuActions?: { label: string; callback: () => void }[];
  resourceStatus?: React.ReactNode;
  navItems?: { title: string; path: string }[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  kindAbbr,
  breadcrumbs,
  menuActions,
  resourceStatus,
  navItems,
}) => {
  return (
    <>
      <PageSection
        variant={PageSectionVariants.light}
        style={{ paddingBottom: 0, paddingTop: 5 }}
      >
        <Stack hasGutter>
          {breadcrumbs && (
            <StackItem>
              <BreadCrumbs breadcrumbs={breadcrumbs} />
            </StackItem>
          )}
          <StackItem>
            <Split>
              <SplitItem isFilled>
                <TextContent>
                  <Text component="h1">
                    {kindAbbr && <Label color="grey">{kindAbbr}</Label>}
                    <span>&nbsp;{title}&nbsp;</span>
                    {resourceStatus}
                  </Text>
                </TextContent>
              </SplitItem>
              {menuActions && (
                <SplitItem>
                  <MenuActions actions={menuActions} />
                </SplitItem>
              )}
            </Split>
          </StackItem>
          {navItems && (
            <StackItem>
              <HorizontalNav navItems={navItems} />
            </StackItem>
          )}
        </Stack>
      </PageSection>
    </>
  );
};

export type BreadCrumbsProps = {
  breadcrumbs: { title: string; path: string }[];
};
export const BreadCrumbs: React.SFC<BreadCrumbsProps> = ({ breadcrumbs }) => (
  <Breadcrumb>
    {breadcrumbs.map((crumb, i, { length }) => {
      const isLast = i === length - 1;

      return (
        <BreadcrumbItem key={i} isActive={isLast}>
          {isLast ? (
            crumb.title
          ) : (
            <Link className="pf-c-breadcrumb__link" to={crumb.path}>
              {crumb.title}
            </Link>
          )}
        </BreadcrumbItem>
      );
    })}
  </Breadcrumb>
);

//

export interface MenuActionsProps {
  actions: { label: string; callback: () => void }[];
}

export const MenuActions: React.FC<MenuActionsProps> = ({ actions }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dropdown
      isOpen={isOpen}
      onSelect={() => {
        setIsOpen(!isOpen);
      }}
      toggle={
        <DropdownToggle
          onToggle={(isOpen: boolean) => {
            setIsOpen(isOpen);
          }}
          toggleIndicator={CaretDownIcon}
        >
          Actions
        </DropdownToggle>
      }
      dropdownItems={actions.map((element, index) => (
        <DropdownItem key={index} component="button" onClick={element.callback}>
          {element.label}
        </DropdownItem>
      ))}
    />
  );
};

//

export interface HorizontalNavProps {
  navItems: { title: string; path: string }[];
}

export const HorizontalNav: React.FC<HorizontalNavProps> = ({ navItems }) => {
  return (
    <div className="pf-c-tabs">
      <ul className="pf-c-tabs__list">
        {navItems.map((f, index) => (
          <NavLink
            key={index}
            to={f.path}
            className="pf-c-tabs__item"
            activeClassName="pf-m-current"
          >
            <li key={index} className="pf-c-tabs__item">
              <button className="pf-c-tabs__link">
                <span className="pf-c-tabs__item-text">{f.title}</span>
              </button>
            </li>
          </NavLink>
        ))}
      </ul>
    </div>
  );
};
