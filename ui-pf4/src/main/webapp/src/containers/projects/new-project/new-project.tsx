import React from "react";
import { PageSection } from "@patternfly/react-core";
import { SimplePageSection } from "../../../components";

export const NewProject: React.FC = () => {
  return (
    <React.Fragment>
      <SimplePageSection title="Create project" />
      <PageSection>
        <p>create project</p>
      </PageSection>
    </React.Fragment>
  );
};
