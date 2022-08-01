import React, { useState } from "react";
import {
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

import { useKeycloak } from "@react-keycloak-fork/web";

import imgAvatar from "images/avatar.svg";

export const UserToolGroup: React.FC = () => {
  const { keycloak } = useKeycloak();

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

  return (
    <>
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
    </>
  );
};
