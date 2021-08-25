import React, { useState } from "react";
import {
  PageHeader,
  Brand,
  PageHeaderTools,
  Avatar,
  PageHeaderToolsGroup,
  PageHeaderToolsItem,
  Dropdown,
  KebabToggle,
  DropdownToggle,
  DropdownGroup,
  DropdownItem,
} from "@patternfly/react-core";
import { UserCircleIcon } from "@patternfly/react-icons";

import { useKeycloak } from "@react-keycloak/web";

import "./HeaderApp.scss";

import navBrandImage from "images/tackle.png";
import imgAvatar from "images/avatar.svg";

import { ButtonAboutApp } from "../ButtonAboutApp";

export const HeaderApp: React.FC = () => {
  const [keycloak] = useKeycloak();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isKebabDropdownOpen, setIsKebabDropdownOpen] = useState(false);

  const onDropdownToggle = (isOpen: boolean) => {
    setIsDropdownOpen(isOpen);
  };
  const onDropdownSelect = () => {
    setIsDropdownOpen((current) => !current);
  };

  const onKebabDropdownToggle = (isOpen: boolean) => {
    setIsKebabDropdownOpen(isOpen);
  };
  const onKebabDropdownSelect = () => {
    setIsKebabDropdownOpen((current) => !current);
  };

  const userDropdownItems = [
    <DropdownGroup key="group1">
      {/* <DropdownItem
        key="group1 accountManagement"
        component="button"
        onClick={() => keycloak.accountManagement()}
      >
        Account management
      </DropdownItem> */}
      <DropdownItem
        key="group1 logout"
        component="button"
        onClick={() => keycloak.logout()}
      >
        Logout
      </DropdownItem>
    </DropdownGroup>,
  ];

  const kebabDropdownItems = [
    <DropdownItem
      key="logout"
      component="button"
      onClick={() => keycloak.logout()}
    >
      <UserCircleIcon /> Logout
    </DropdownItem>,
  ];

  const renderPageToolbar = (
    <PageHeaderTools>
      <PageHeaderToolsGroup
        visibility={{
          default: "hidden",
          "2xl": "visible",
          xl: "visible",
          lg: "visible",
          md: "hidden",
          sm: "hidden",
        }}
      >
        <PageHeaderToolsItem>
          <ButtonAboutApp />
        </PageHeaderToolsItem>
      </PageHeaderToolsGroup>
      <PageHeaderToolsGroup>
        <PageHeaderToolsItem
          visibility={{
            lg: "hidden",
          }} /** this kebab dropdown replaces the icon buttons and is hidden for desktop sizes */
        >
          <Dropdown
            isPlain
            position="right"
            onSelect={onKebabDropdownSelect}
            toggle={<KebabToggle onToggle={onKebabDropdownToggle} />}
            isOpen={isKebabDropdownOpen}
            dropdownItems={kebabDropdownItems}
          />
        </PageHeaderToolsItem>
        {keycloak && (
          <PageHeaderToolsItem
            visibility={{
              default: "hidden",
              md: "visible",
            }} /** this user dropdown is hidden on mobile sizes */
          >
            <Dropdown
              isPlain
              position="right"
              onSelect={onDropdownSelect}
              isOpen={isDropdownOpen}
              toggle={
                <DropdownToggle onToggle={onDropdownToggle}>
                  {(keycloak.idTokenParsed as any)["preferred_username"]}
                </DropdownToggle>
              }
              dropdownItems={userDropdownItems}
            />
          </PageHeaderToolsItem>
        )}
      </PageHeaderToolsGroup>
      <Avatar src={imgAvatar} alt="Avatar image" />
    </PageHeaderTools>
  );

  return (
    <PageHeader
      className="header-app__component"
      logo={<Brand src={navBrandImage} alt="brand" />}
      headerTools={renderPageToolbar}
      showNavToggle
    />
  );
};
