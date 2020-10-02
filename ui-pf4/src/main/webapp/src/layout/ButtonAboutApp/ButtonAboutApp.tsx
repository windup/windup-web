import * as React from "react";
import {
  AboutModal,
  TextContent,
  TextList,
  TextListItem,
  Button,
  ButtonVariant,
} from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";
import brandImage from "../../img/mta-logo-header.svg";

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
          trademark="COPYRIGHT © 2020."
          brandImageSrc={brandImage}
          brandImageAlt="Logo"
          productName="Windup Web Console"
        >
          <TextContent>
            <TextList component="dl">
              <TextListItem component="dt">Source code</TextListItem>
              <TextListItem component="dd">
                <a href="https://github.com/windup/windup-web">Github</a>
              </TextListItem>
            </TextList>
          </TextContent>
        </AboutModal>
      </>
    );
  }
}
