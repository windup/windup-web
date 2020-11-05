import React from "react";
import {
  EmptyState,
  EmptyStateIcon,
  Title,
  Button,
  EmptyStateVariant,
  EmptyStateSecondaryActions,
  Bullseye,
  Spinner,
} from "@patternfly/react-core";

export interface LoadingStepProps {
  customText: string;
  cancelTitle?: string;
  onClose?: () => void;
}

export const LoadingStep: React.FC<LoadingStepProps> = ({
  customText,
  cancelTitle,
  onClose,
}) => {
  return (
    <Bullseye>
      <EmptyState variant={EmptyStateVariant.full} className="pf-u-mt-4xl">
        <EmptyStateIcon icon={Spinner} className="pf-u-mb-0" />
        <Title headingLevel="h2" size="xl" className="pf-u-mt-xl">
          {customText}
        </Title>
        {onClose && (
          <EmptyStateSecondaryActions className="pf-u-mt-xl">
            <Button variant="link" onClick={onClose}>
              {cancelTitle}
            </Button>
          </EmptyStateSecondaryActions>
        )}
      </EmptyState>
    </Bullseye>
  );
};
