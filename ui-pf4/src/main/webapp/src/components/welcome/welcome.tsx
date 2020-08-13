import * as React from "react";
import {
  EmptyState,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
  Button,
  EmptyStateVariant,
  EmptyStateSecondaryActions,
} from "@patternfly/react-core";
import { CubesIcon } from "@patternfly/react-icons";

export interface WelcomeProps {
  onPrimaryAction?: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onPrimaryAction }) => {
  return (
    <EmptyState variant={EmptyStateVariant.small}>
      <EmptyStateIcon icon={CubesIcon} />
      <Title headingLevel="h4" size="lg">
        Welcome to the Migration Toolkit for Applications
      </Title>
      <EmptyStateBody>
        The Red Hat Migration Toolkit for Applications helps you quickly assess
        and perform large-scale application migrations and modernizations. Start
        by creating a project for your applications.
      </EmptyStateBody>
      <Button variant="primary" onClick={onPrimaryAction}>
        New project
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
