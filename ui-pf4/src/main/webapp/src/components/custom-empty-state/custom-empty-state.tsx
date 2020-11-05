import React from "react";
import {
  EmptyState,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
  Button,
  EmptyStateVariant,
  EmptyStateSecondaryActions,
} from "@patternfly/react-core";

export interface CustomEmptyStateProps {
  icon?: React.ComponentType<any>;
  title: string;
  body?: string;
  primaryAction?: [string, () => void, boolean?];
  secondaryActions?: React.ReactNodeArray;
}

export const CustomEmptyState: React.FC<CustomEmptyStateProps> = ({
  icon,
  title,
  body,
  primaryAction,
  secondaryActions,
}) => {
  return (
    <EmptyState variant={EmptyStateVariant.small}>
      {icon && <EmptyStateIcon icon={icon} />}
      <Title headingLevel="h4" size="lg">
        {title}
      </Title>
      {body && <EmptyStateBody>{body}</EmptyStateBody>}
      {primaryAction && (
        <Button
          variant="primary"
          onClick={primaryAction[1]}
          isDisabled={primaryAction[2] || false}
        >
          {primaryAction[0]}
        </Button>
      )}
      {secondaryActions && (
        <EmptyStateSecondaryActions>
          {secondaryActions}
        </EmptyStateSecondaryActions>
      )}
    </EmptyState>
  );
};
