import React from "react";
import {
  PageHeader,
  Brand,
  PageHeaderTools,
  PageHeaderToolsGroup,
  PageHeaderToolsItem,
} from "@patternfly/react-core";

import "./HeaderApp.scss";

import { ButtonAboutApp } from "../ButtonAboutApp";
import { Theme } from "layout/ThemeUtils";
import { UserToolGroup } from "./UserToolGroup";
import { isSSOEnabled } from "Constants";

export const HeaderApp: React.FC = () => {
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
      {isSSOEnabled() && <UserToolGroup />}
    </PageHeaderTools>
  );

  return (
    <PageHeader
      className="header-app__component"
      logo={<Brand src={Theme.logoNavbarSrc} alt="brand" />}
      headerTools={renderPageToolbar}
      showNavToggle
    />
  );
};
