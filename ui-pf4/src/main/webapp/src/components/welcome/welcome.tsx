import React from "react";
import {
  EmptyState,
  Title,
  EmptyStateBody,
  Button,
  EmptyStateVariant,
  EmptyStateSecondaryActions,
} from "@patternfly/react-core";
import { ProcessImprovementIcon } from "components";

export interface WelcomeProps {
  onPrimaryAction: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onPrimaryAction }) => {
  return (
    <EmptyState variant={EmptyStateVariant.large}>
      {/* <EmptyStateIcon icon={ProcessImprovementIcon} /> */}
      <div>
        <ProcessImprovementIcon
          height="54px"
          className="pf-c-empty-state__icon"
          style={{ opacity: 0.6 }}
        />
      </div>
      <Title headingLevel="h4" size="lg">
        Welcome to the Migration Toolkit for Applications
      </Title>
      <EmptyStateBody>
        The Migration Toolkit for Applications helps you assess and perform
        large-scale application migrations and modernizations. Start by creating
        a project for your applications.
      </EmptyStateBody>
      <Button variant="primary" onClick={onPrimaryAction}>
        Create Project
      </Button>
      <EmptyStateSecondaryActions>
        To learn more, visit the
        <a
          target="_blank"
          href="https://access.redhat.com/documentation/en-us/migration_toolkit_for_applications/"
          rel="noopener noreferrer"
        >
          documentation
        </a>
      </EmptyStateSecondaryActions>
    </EmptyState>
  );
};
