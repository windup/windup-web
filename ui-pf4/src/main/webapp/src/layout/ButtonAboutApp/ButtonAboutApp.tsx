import React from "react";
import {
  AboutModal,
  TextContent,
  TextList,
  TextListItem,
  Button,
  ButtonVariant,
  List,
  ListItem,
} from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";

import brandImage from "img/red-hat-horizontal-reverse.svg";
import { WINDUP_WEB_SCM_REVISION, WINDUP_WEB_VERSION } from "Constants";

export interface ButtonAboutProjectProps {}

interface State {
  isOpen: boolean;
}

export class ButtonAboutApp extends React.Component<
  ButtonAboutProjectProps,
  State
> {
  constructor(props: ButtonAboutProjectProps) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  toggleButton = () => {
    this.setState(({ isOpen }) => ({
      isOpen: !isOpen,
    }));
  };

  render() {
    const { isOpen } = this.state;
    return (
      <>
        <Button
          id="aboutButton"
          aria-label="About button"
          variant={ButtonVariant.plain}
          onClick={this.toggleButton}
        >
          <HelpIcon />
        </Button>
        <AboutModal
          isOpen={isOpen}
          onClose={this.toggleButton}
          brandImageAlt="Red Hat"
          brandImageSrc={brandImage}
          productName="Migration Toolkit for Applications"
        >
          <TextContent className="pf-u-py-xl">
            <h4>About</h4>
            <p>
              <a
                href="https://developers.redhat.com/products/mta/overview/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Migration Toolkit for Applications
              </a>{" "}
              allows application architects and developers to quickly decompile,
              analyze, assess and modernize large scale application portfolios
              and migrate them to Red Hat Middleware, cloud and containers.
            </p>
          </TextContent>
          <TextContent className="pf-u-py-xl">
            <TextList component="dl">
              <TextListItem component="dt">
                Migration Toolkit for Applications Core
              </TextListItem>
              <TextListItem component="dd">{WINDUP_WEB_VERSION}</TextListItem>
              <TextListItem component="dt">
                Migration Toolkit for Applications Web Console
              </TextListItem>
              <TextListItem component="dd">
                {WINDUP_WEB_SCM_REVISION}
              </TextListItem>
            </TextList>
          </TextContent>
          <TextContent>
            <h4>Links</h4>
            <List>
              <ListItem>
                <a
                  href="https://developers.redhat.com/products/mta/overview/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Website
                </a>
              </ListItem>
              <ListItem>
                <a
                  href="https://access.redhat.com/documentation/en-us/migration_toolkit_for_applications/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Documentation
                </a>
              </ListItem>
            </List>
          </TextContent>
        </AboutModal>
      </>
    );
  }
}
