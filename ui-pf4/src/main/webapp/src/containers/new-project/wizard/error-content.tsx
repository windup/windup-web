import React from "react";

import {
  Bullseye,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
  EmptyStateSecondaryActions,
  Button,
} from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
import { global_danger_color_200 as globalDangerColor200 } from "@patternfly/react-tokens";

export const ErrorWizardContent = ({ message }: { message?: string }) => {
  return (
    <Bullseye>
      <EmptyState variant={EmptyStateVariant.small}>
        <EmptyStateIcon
          icon={ExclamationCircleIcon}
          color={globalDangerColor200.value}
        />
        <Title headingLevel="h2" size="lg">
          Unable to continue
        </Title>
        <EmptyStateBody>
          {message
            ? message
            : "There was an error retrieving/processing data. Check your connection and try again."}
        </EmptyStateBody>
        <EmptyStateSecondaryActions>
          <Button
            variant="link"
            onClick={() => {
              window.location.reload();
            }}
          >
            Retry
          </Button>
        </EmptyStateSecondaryActions>
      </EmptyState>
    </Bullseye>
  );
};
