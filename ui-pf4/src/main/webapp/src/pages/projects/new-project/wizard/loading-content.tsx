import React from "react";

import {
  Bullseye,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  Title,
} from "@patternfly/react-core";
import { InProgressIcon } from "@patternfly/react-icons";

export const LoadingWizardContent: React.FC = () => {
  return (
    <Bullseye>
      <EmptyState variant={EmptyStateVariant.small}>
        <EmptyStateIcon icon={InProgressIcon} />
        <Title headingLevel="h2" size="lg">
          Loading...
        </Title>
      </EmptyState>
    </Bullseye>
  );
};
