import React from "react";
import {
  EmptyState,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
  EmptyStateVariant,
} from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";

export interface FetchErrorProps {}

export const FetchError: React.FC<FetchErrorProps> = () => {
  return (
    <EmptyState variant={EmptyStateVariant.small}>
      <EmptyStateIcon icon={ExclamationCircleIcon} />
      <Title headingLevel="h4" size="lg">
        Restricted Access
      </Title>
      <EmptyStateBody>
        You don't have access to this section, make sure you have selected the
        right Project.
      </EmptyStateBody>
    </EmptyState>
  );
};
