import React from "react";

import { Button, ButtonVariant } from "@patternfly/react-core";
import { css } from "@patternfly/react-styles";
import styles from "@patternfly/react-styles/css/components/Wizard/wizard";

export interface WizardFooterProps {
  isDisabled?: boolean;
  isNextDisabled?: boolean;
  hideBackButton?: boolean;
  onNext: () => void;
  onBack?: () => void;
  onCancel: () => void;
}

export const WizardFooter: React.FC<WizardFooterProps> = ({
  isDisabled,
  isNextDisabled,
  hideBackButton,
  onNext,
  onBack,
  onCancel,
}) => {
  return (
    <footer className={css(styles.wizardFooter)}>
      <Button
        variant={ButtonVariant.primary}
        onClick={onNext}
        isDisabled={isDisabled ? isDisabled : isNextDisabled}
      >
        Next
      </Button>
      {!hideBackButton && (
        <Button
          variant={ButtonVariant.secondary}
          onClick={onBack}
          isDisabled={isDisabled}
        >
          Back
        </Button>
      )}
      <Button
        variant={ButtonVariant.link}
        onClick={onCancel}
        isDisabled={isDisabled}
      >
        Cancel
      </Button>
    </footer>
  );
};
