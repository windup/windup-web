import React from "react";
import {
  EmptyState,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
  EmptyStateVariant,
  Bullseye,
} from "@patternfly/react-core";
import { MiddlewareIcon } from "@patternfly/react-icons";

export interface SelectProjectEmptyMessageProps {}

export const SelectProjectEmptyMessage: React.FC<SelectProjectEmptyMessageProps> = () => {
  return (
    <Bullseye>
      <EmptyState variant={EmptyStateVariant.small}>
        <EmptyStateIcon icon={MiddlewareIcon} />
        <Title headingLevel="h4" size="lg">
          Select a Project
        </Title>
        <EmptyStateBody>
          Please select the project you want to see data from.
        </EmptyStateBody>
      </EmptyState>
    </Bullseye>
  );
};
