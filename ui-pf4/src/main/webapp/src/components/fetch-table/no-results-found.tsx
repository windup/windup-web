import React from "react";
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title,
} from "@patternfly/react-core";
import { SearchIcon } from "@patternfly/react-icons";

export interface NoResultsFoundProps {
  onClearFilters?: () => void;
}

export const NoResultsFound: React.FC<NoResultsFoundProps> = ({
  onClearFilters,
}) => {
  return (
    <EmptyState variant={EmptyStateVariant.small}>
      <EmptyStateIcon icon={SearchIcon} />
      <Title headingLevel="h2" size="lg">
        No results found
      </Title>
      <EmptyStateBody>
        No results match the filter criteria. Remove all filters or clear all
        filters to show results.
      </EmptyStateBody>
      {onClearFilters && (
        <Button variant="link" onClick={onClearFilters}>
          Clear all filters
        </Button>
      )}
    </EmptyState>
  );
};
