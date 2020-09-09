import React from "react";
import { RouteComponentProps } from "react-router-dom";

import {
  PageSection,
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
  ButtonVariant,
} from "@patternfly/react-core";
import { InProgressIcon, ExclamationCircleIcon } from "@patternfly/react-icons";
import { global_danger_color_200 as globalDangerColor200 } from "@patternfly/react-tokens";
import { css } from "@patternfly/react-styles";
import styles from "@patternfly/react-styles/css/components/Wizard/wizard";

import { SimplePageSection } from "components";
import { formatPath, Paths } from "Paths";
import { MigrationProject } from "models/api";

const TITLE = "Create project";
const DESCRIPTION = "Create a project for your applications";

export enum WizardStepIds {
  DETAILS = 1,
  ADD_APPLICATIONS = 2,
  SET_TRANSFORMATION_PATH = 3,
  SELECT_PACKAGES = 4,
  CUSTOM_RULES = 5,
  CUSTOM_LABELS = 6,
  ADVANCED_OPTIONS = 7,
  REVIEW = 8,
}

export interface NewProjectWizardProps extends RouteComponentProps {
  isWizard?: boolean;
  stepId: WizardStepIds;
  enableNext: boolean;
  disableNavigation?: boolean;
  showErrorContent?: string;
  migrationProject?: MigrationProject;
  handleOnNextStep: () => void;
}

const disableWizardSteps = (array: WizardStep[]): WizardStep[] => {
  return array.map((element) => {
    return {
      ...element,
      canJumpTo: false,
      enableNext: false,
      hideBackButton: true,
      hideCancelButton: true,
      steps: element.steps ? disableWizardSteps(element.steps) : undefined,
    };
  });
};

export const NewProjectWizard: React.FC<NewProjectWizardProps> = ({
  history: { push },
  isWizard = false,
  stepId,
  enableNext,
  disableNavigation,
  migrationProject,
  showErrorContent,
  children,
  handleOnNextStep,
}) => {
  const wizardSteps: WizardStep[] = [
    {
      id: WizardStepIds.DETAILS,
      name: "Details",
      component: undefined,
      canJumpTo: WizardStepIds.DETAILS <= stepId,
      enableNext: false,
    },
    {
      id: WizardStepIds.ADD_APPLICATIONS,
      name: "Add applications",
      component: undefined,
      canJumpTo: WizardStepIds.ADD_APPLICATIONS <= stepId,
      enableNext: false,
    },
    {
      name: "Configure the analysis",
      steps: [
        {
          id: WizardStepIds.SET_TRANSFORMATION_PATH,
          name: "Set transformation path",
          component: undefined,
          canJumpTo: WizardStepIds.SET_TRANSFORMATION_PATH <= stepId,
          enableNext: false,
        },
        {
          id: WizardStepIds.SELECT_PACKAGES,
          name: "Select packages",
          canJumpTo: WizardStepIds.SELECT_PACKAGES <= stepId,
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
          canJumpTo: WizardStepIds.CUSTOM_RULES <= stepId,
          enableNext: false,
        },
        {
          id: WizardStepIds.CUSTOM_LABELS,
          name: "Custom labels",
          canJumpTo: WizardStepIds.CUSTOM_LABELS <= stepId,
          enableNext: false,
        },
        {
          id: WizardStepIds.ADVANCED_OPTIONS,
          name: "Options",
          canJumpTo: WizardStepIds.ADVANCED_OPTIONS <= stepId,
          enableNext: false,
        },
      ],
    },
    {
      id: WizardStepIds.REVIEW,
      name: "Review",
      component: undefined,
      canJumpTo: WizardStepIds.REVIEW <= stepId,
      enableNext: false,
    },
  ];

  let selectedStep: WizardStep;

  switch (stepId) {
    case WizardStepIds.DETAILS:
      selectedStep = wizardSteps[0];
      break;

    case WizardStepIds.ADD_APPLICATIONS:
      selectedStep = wizardSteps[1];
      break;

    case WizardStepIds.SET_TRANSFORMATION_PATH:
      selectedStep = wizardSteps[2].steps![0];
      break;
    case WizardStepIds.SELECT_PACKAGES:
      selectedStep = wizardSteps[2].steps![1];
      break;

    case WizardStepIds.CUSTOM_RULES:
      selectedStep = wizardSteps[3].steps![0];
      break;
    case WizardStepIds.CUSTOM_LABELS:
      selectedStep = wizardSteps[3].steps![1];
      break;
    case WizardStepIds.ADVANCED_OPTIONS:
      selectedStep = wizardSteps[3].steps![2];
      break;

    case WizardStepIds.REVIEW:
      selectedStep = wizardSteps[4];
      break;
  }

  selectedStep.canJumpTo = true;
  selectedStep.enableNext = enableNext;
  selectedStep.component = !showErrorContent ? (
    children
  ) : (
    <ErrorWizardContent />
  );

  const handleOnBack = () => {
    handleOnGoToStep(
      { id: stepId - 1, name: "" },
      { prevId: stepId, prevName: "" }
    );
  };

  const handleOnClose = () => {
    push(Paths.projects);
  };

  const handleOnGoToStep = (
    newStep: { id?: string | number; name: React.ReactNode },
    prevStep: { prevId?: string | number; prevName: React.ReactNode }
  ) => {
    if (newStep.id === prevStep.prevId) {
      return;
    }

    switch (newStep.id) {
      case WizardStepIds.DETAILS:
        push(
          formatPath(Paths.newProject_details, {
            project: migrationProject?.id,
          })
        );
        break;
      case WizardStepIds.ADD_APPLICATIONS:
        push(
          formatPath(Paths.newProject_addApplications, {
            project: migrationProject?.id,
          })
        );
        break;
      case WizardStepIds.SET_TRANSFORMATION_PATH:
        push(
          formatPath(Paths.newProject_setTransformationPath, {
            project: migrationProject?.id,
          })
        );
        break;
      case WizardStepIds.SELECT_PACKAGES:
        push(
          formatPath(Paths.newProject_selectPackages, {
            project: migrationProject?.id,
          })
        );
        break;
      case WizardStepIds.CUSTOM_RULES:
        push(
          formatPath(Paths.newProject_customRules, {
            project: migrationProject?.id,
          })
        );
        break;
      case WizardStepIds.CUSTOM_LABELS:
        push(
          formatPath(Paths.newProject_customLabels, {
            project: migrationProject?.id,
          })
        );
        break;
      case WizardStepIds.ADVANCED_OPTIONS:
        push(
          formatPath(Paths.newProject_advandedOptions, {
            project: migrationProject?.id,
          })
        );
        break;
      default:
        new Error("Can not go to step id[" + newStep.id + "]");
    }
  };

  return (
    <React.Fragment>
      <SimplePageSection title={TITLE} description={DESCRIPTION} />
      <PageSection>
        <Wizard
          title={isWizard ? TITLE : undefined}
          description={isWizard ? DESCRIPTION : undefined}
          isOpen={isWizard ? isWizard : undefined}
          steps={
            !disableNavigation ? wizardSteps : disableWizardSteps(wizardSteps)
          }
          startAtStep={stepId}
          onNext={handleOnNextStep}
          onBack={handleOnGoToStep}
          onGoToStep={handleOnGoToStep}
          onClose={handleOnClose}
          navAriaLabel="New project steps"
          mainAriaLabel="New project content"
          footer={
            <footer className={css(styles.wizardFooter)}>
              <Button
                variant={ButtonVariant.primary}
                type="submit"
                onClick={handleOnNextStep}
                isDisabled={disableNavigation ? disableNavigation : !enableNext}
              >
                Next
              </Button>
              <Button
                variant={ButtonVariant.secondary}
                onClick={handleOnBack}
                className={css(
                  stepId === WizardStepIds.DETAILS && "pf-m-disabled"
                )}
                isDisabled={disableNavigation}
              >
                Back
              </Button>
              <Button
                variant={ButtonVariant.link}
                onClick={handleOnClose}
                isDisabled={disableNavigation}
              >
                Cancel
              </Button>
            </footer>
          }
        />
      </PageSection>
    </React.Fragment>
  );
};

export const LoadingWizardContent: React.FC = () => {
  return (
    <Bullseye>
      <EmptyState variant={EmptyStateVariant.small}>
        <EmptyStateIcon icon={InProgressIcon} />
        <Title headingLevel="h2" size="lg">
          Loading...
        </Title>
      </EmptyState>
    </Bullseye>
  );
};

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
