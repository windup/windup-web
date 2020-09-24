import * as React from "react";
import {
  PageSection,
  PageSectionVariants,
  Divider,
} from "@patternfly/react-core";

import "./project-context-page-section.scss";

export const ProjectContextPageSection: React.FC = ({ children }) => {
  return (
    <PageSection
      variant={PageSectionVariants.light}
      className="project-context-page__component__page-section"
    >
      <div className="project-context-page__component__content">{children}</div>
      <Divider className="project-context-page__component__divider" />
    </PageSection>
  );
};
