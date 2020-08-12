import React from "react";
import { PageSection } from "@patternfly/react-core";
import { SimplePageSection } from "../../../components";

export const NewOrganization: React.FC = () => {
  return (
    <React.Fragment>
      <SimplePageSection title="Create organization" />
      <PageSection>
        <p>create org</p>
      </PageSection>
    </React.Fragment>
  );
};
