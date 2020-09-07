import * as React from "react";

import {
  Wizard,
  WizardStep,
  Bullseye,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
  EmptyStateSecondaryActions,
  Button,
} from "@patternfly/react-core";
import { InProgressIcon, ExclamationCircleIcon } from "@patternfly/react-icons";
import { global_danger_color_200 as globalDangerColor200 } from "@patternfly/react-tokens";

import { MigrationProject } from "models/api";

import { TITLE, DESCRIPTION } from "./constants";

export const LoadingWizard: React.FC<{}> = () => {
  return (
    <Wizard
      isOpen={true}
      title={TITLE}
      description={DESCRIPTION}
      steps={[
        {
          name: "Loading",
          component: (
            <Bullseye>
              <div style={{ marginTop: 400 }}></div>
              <EmptyState variant={EmptyStateVariant.small}>
                <EmptyStateIcon icon={InProgressIcon} />
                <Title headingLevel="h4" size="lg">
                  Loading...
                </Title>
              </EmptyState>
            </Bullseye>
          ),
          isFinishedStep: true,
        },
      ]}
    />
  );
};

export const ErrorWizard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <Wizard
      isOpen={true}
      title={TITLE}
      description={DESCRIPTION}
      onClose={onClose}
      steps={[
        {
          name: "Error",
          component: (
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
                  There was an error retrieving/processing data. Check your
                  connection and try again.
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
          ),
          isFinishedStep: true,
        },
      ]}
    />
  );
};

export enum WizardStepIds {
  DETAILS = 1,
  ADD_APPLICATIONS = 2,
  SET_TRANSFORMATION_PATH = 3,
  SELECT_PACKAGES = 4,
  CUSTOM_RULES = 5,
  CUSTOM_LABELS = 6,
  OPTIONS = 7,
  REVIEW = 8,
}

export const buildWizard = (
  stepId: WizardStepIds,
  wizardStep: WizardStep,
  wizardProps: any,
  migrationProject?: MigrationProject
) => {
  let wizardSteps: WizardStep[] = [
    {
      id: WizardStepIds.DETAILS,
      name: "Details",
      component: undefined,
      canJumpTo:
        WizardStepIds.DETAILS <= stepId || migrationProject !== undefined,
      enableNext: false,
    },
    {
      id: WizardStepIds.ADD_APPLICATIONS,
      name: "Add applications",
      component: undefined,
      canJumpTo:
        WizardStepIds.ADD_APPLICATIONS <= stepId ||
        migrationProject !== undefined,
      enableNext: false,
    },
    {
      name: "Configure the analysis",
      steps: [
        {
          id: WizardStepIds.SET_TRANSFORMATION_PATH,
          name: "Set transformation path",
          component: undefined,
          canJumpTo:
            WizardStepIds.SET_TRANSFORMATION_PATH <= stepId ||
            (migrationProject && migrationProject.applications.length > 0),
          enableNext: false,
        },
        {
          id: WizardStepIds.SELECT_PACKAGES,
          name: "Select packages",
          canJumpTo: false,
          enableNext: false,
        },
      ],
    },
    {
      name: "Advanced",
      steps: [
        {
          id: WizardStepIds.CUSTOM_RULES,
          name: "Custom rules",
          component: undefined,
          canJumpTo: false,
          enableNext: false,
        },
        {
          id: WizardStepIds.CUSTOM_LABELS,
          name: "Custom labels",
          canJumpTo: false,
          enableNext: false,
        },
        {
          id: WizardStepIds.OPTIONS,
          name: "Options",
          canJumpTo: false,
          enableNext: false,
        },
      ],
    },
    {
      id: WizardStepIds.REVIEW,
      name: "Review",
      component: undefined,
      canJumpTo: false,
      enableNext: false,
    },
  ];

  switch (stepId) {
    case WizardStepIds.DETAILS:
      wizardSteps[0] = wizardStep;
      break;

    case WizardStepIds.ADD_APPLICATIONS:
      wizardSteps[1] = wizardStep;
      break;

    case WizardStepIds.SET_TRANSFORMATION_PATH:
      wizardSteps[2].steps![0] = wizardStep;
      break;
    case WizardStepIds.SELECT_PACKAGES:
      wizardSteps[2].steps![1] = wizardStep;
      break;

    case WizardStepIds.CUSTOM_RULES:
      wizardSteps[3].steps![0] = wizardStep;
      break;
    case WizardStepIds.CUSTOM_LABELS:
      wizardSteps[3].steps![1] = wizardStep;
      break;
    case WizardStepIds.OPTIONS:
      wizardSteps[3].steps![2] = wizardStep;
      break;

    case WizardStepIds.REVIEW:
      wizardSteps[4] = wizardStep;
      break;
  }

  return (
    <Wizard
      isOpen={true}
      title={TITLE}
      description={DESCRIPTION}
      steps={wizardSteps}
      startAtStep={stepId}
      {...wizardProps}
    />
  );
};
