import React, { useEffect, useState } from "react";
import {
  AboutModal,
  TextContent,
  Button,
  ButtonVariant,
  List,
  ListItem,
  Flex,
  FlexItem,
  Grid,
  GridItem,
} from "@patternfly/react-core";
import {
  HelpIcon,
  GithubIcon,
  BookOpenIcon,
  GlobeIcon,
  EnvelopeIcon,
  InfoAltIcon,
} from "@patternfly/react-icons";

import "./ButtonAboutApp.scss";

import { WINDUP_WEB_VERSION, WINDUP_WEB_SCM_REVISION } from "Constants";
import { getWindupVersion } from "api/api";

import brandImage from "images/red-hat-horizontal-reverse.svg";
import { WindupVersion } from "models/api";

export const ButtonAboutApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [windupVersion, setWindupVersion] = useState<WindupVersion>({
    version: "(loading)",
    scmRevision: "(loading)",
  });

  useEffect(() => {
    getWindupVersion().then(({ data }) => {
      setWindupVersion(data);
    });
  }, []);

  const toggleButton = () => {
    setIsOpen((current) => !current);
  };

  return (
    <>
      <Button
        id="aboutButton"
        aria-label="About button"
        variant={ButtonVariant.plain}
        onClick={toggleButton}
      >
        <HelpIcon />
      </Button>
      <AboutModal
        isOpen={isOpen}
        onClose={toggleButton}
        brandImageAlt="Red Hat"
        brandImageSrc={brandImage}
        productName="Migration Toolkit for Applications"
        className="about-app__component"
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
            analyze, assess and modernize large scale application portfolios and
            migrate them to Red Hat Middleware, cloud and containers.
          </p>
        </TextContent>
        <TextContent className="pf-u-py-xl">
          <Grid hasGutter>
            <GridItem lg={7}>
              <span className="dt">
                Migration Toolkit for Applications Core
              </span>
            </GridItem>
            <GridItem lg={5}>
              {windupVersion.version}
              {windupVersion.version.indexOf("SNAPSHOT") !== -1 && (
                <>
                  {"("}
                  <a
                    target="_blank"
                    href={`https://github.com/windup/windup/tree/${windupVersion.scmRevision}/`}
                    rel="noopener noreferrer"
                  >
                    git revision
                  </a>
                  {")"}
                </>
              )}
            </GridItem>
            <GridItem lg={7}>
              <span className="dt">
                Migration Toolkit for Applications Web Console
              </span>
            </GridItem>
            <GridItem lg={5}>
              {WINDUP_WEB_VERSION}
              {WINDUP_WEB_VERSION.indexOf("SNAPSHOT") !== -1 && (
                <>
                  {"("}
                  <a
                    target="_blank"
                    href={`https://github.com/windup/windup-web/tree/${WINDUP_WEB_SCM_REVISION}/`}
                    rel="noopener noreferrer"
                  >
                    git revision
                  </a>
                  {")"}
                </>
              )}
            </GridItem>
          </Grid>
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
        <div className="pf-c-about-modal-box__strapline">
          <Flex>
            <FlexItem>
              <a
                href="https://github.com/windup/windup"
                rel="noopener noreferrer"
                target="_blank"
              >
                <i>
                  <GithubIcon />
                </i>{" "}
                Source
              </a>
            </FlexItem>
            <FlexItem>
              <a
                href="https://github.com/windup/windup/wiki"
                rel="noopener noreferrer"
                target="_blank"
              >
                <i>
                  <BookOpenIcon />
                </i>{" "}
                Wiki
              </a>
            </FlexItem>
            <FlexItem>
              <a
                href="https://developer.jboss.org/en/windup?view=discussions"
                rel="noopener noreferrer"
                target="_blank"
              >
                <i>
                  <GlobeIcon />
                </i>{" "}
                Discussion forum
              </a>
            </FlexItem>
            <FlexItem>
              <a
                href="https://lists.jboss.org/mailman/listinfo/windup-dev"
                rel="noopener noreferrer"
                target="_blank"
              >
                <i>
                  <EnvelopeIcon />
                </i>{" "}
                Mailing list
              </a>
            </FlexItem>
            <FlexItem>
              <a
                href="https://issues.jboss.org/browse/WINDUP"
                rel="noopener noreferrer"
                target="_blank"
              >
                <i>
                  <InfoAltIcon />
                </i>{" "}
                Issue tracking
              </a>
            </FlexItem>
          </Flex>
        </div>
      </AboutModal>
    </>
  );
};
