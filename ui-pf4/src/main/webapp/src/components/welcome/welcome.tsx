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
import { Theme } from "layout/ThemeUtils";

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
        Welcome to {Theme.name}
      </Title>
      <EmptyStateBody>
        {Theme.name} helps you assess and perform large-scale application
        migrations and modernizations. Start by creating a project for your
        applications.
      </EmptyStateBody>
      <Button variant="primary" onClick={onPrimaryAction}>
        Create project
      </Button>
      <EmptyStateSecondaryActions>
        To learn more, visit the
        <a
          target="_blank"
          href={Theme.documentationURL}
          rel="noopener noreferrer"
        >
          documentation
        </a>
        .
      </EmptyStateSecondaryActions>
    </EmptyState>
  );
};
