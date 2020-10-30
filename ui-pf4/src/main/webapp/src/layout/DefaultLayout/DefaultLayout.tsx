import React, { useState } from "react";
import { Page, SkipToContent, Button } from "@patternfly/react-core";
import { Flex, FlexItem, Banner } from "@patternfly/react-core";
import { TimesIcon } from "@patternfly/react-icons";

import { HeaderApp } from "../HeaderApp";
import { SidebarApp } from "../SidebarApp";

export const DefaultLayout: React.FC = ({ children }) => {
  const [showBanner, setShowBanner] = useState(true);

  const pageId = "main-content-page-layout-horizontal-nav";
  const PageSkipToContent = (
    <SkipToContent href={`#${pageId}`}>Skip to content</SkipToContent>
  );

  return (
    <>
      <Flex
        direction={{ default: "column" }}
        flexWrap={{ default: "nowrap" }}
        spaceItems={{ default: "spaceItemsNone" }}
        style={{ height: "100%" }}
      >
        {showBanner && (
          <FlexItem>
            <Banner variant="default" isSticky>
              <Flex
                justifyContent={{
                  default: "justifyContentCenter",
                  lg: "justifyContentSpaceBetween",
                }}
                flexWrap={{ default: "nowrap" }}
              >
                <div className="pf-u-display-none pf-u-display-block-on-lg"></div>
                <div className="pf-u-display-none pf-u-display-block-on-lg">
                  Continue using&nbsp;
                  <a href={`${window.location.origin}/mta-web`}>old UI</a>
                </div>
                <div className="pf-u-display-none-on-lg">
                  Continue using&nbsp;
                  <a href={`${window.location.origin}/mta-web`}>old UI</a>
                </div>
                <div className="pf-u-display-none pf-u-display-block-on-lg">
                  <Button
                    variant="plain"
                    aria-label="Action"
                    onClick={() => setShowBanner(false)}
                    style={{ padding: 0 }}
                  >
                    <TimesIcon />
                  </Button>
                </div>
              </Flex>
            </Banner>
          </FlexItem>
        )}
        <FlexItem grow={{ default: "grow" }} style={{ minHeight: 0 }}>
          <Page
            header={<HeaderApp />}
            sidebar={<SidebarApp />}
            isManagedSidebar
            skipToContent={PageSkipToContent}
            mainContainerId={pageId}
          >
            {children}
          </Page>
        </FlexItem>
      </Flex>
    </>
  );
};
