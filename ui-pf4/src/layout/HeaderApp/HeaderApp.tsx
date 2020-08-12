import * as React from "react";
import {
  PageHeader,
  Brand,
  PageHeaderTools,
  Avatar,
  PageHeaderToolsGroup,
  PageHeaderToolsItem,
} from "@patternfly/react-core";

import navBrandImage from "../../img/mta-logo-header.svg";
import imgAvatar from "../../img/avatar.svg";

import { ButtonAboutApp } from "../ButtonAboutApp";

export interface HeaderProps {}

interface State {}

export class HeaderApp extends React.Component<HeaderProps, State> {
  renderPageToolbar = () => {
    return (
      <React.Fragment>
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
          <Avatar src={imgAvatar} alt="Avatar image" />
        </PageHeaderTools>
      </React.Fragment>
    );
  };

  render() {
    return (
      <PageHeader
        logo={<Brand src={navBrandImage} alt="brand" />}
        headerTools={this.renderPageToolbar()}
        showNavToggle
      />
    );
  }
}
