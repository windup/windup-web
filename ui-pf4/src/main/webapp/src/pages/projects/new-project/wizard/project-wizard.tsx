import React from "react";
import { RouteComponentProps } from "react-router-dom";

import {
  Wizard,
  WizardStep,
  Button,
  ButtonVariant,
} from "@patternfly/react-core";
import { css } from "@patternfly/react-styles";
import styles from "@patternfly/react-styles/css/components/Wizard/wizard";

import { formatPath, Paths } from "Paths";
import { MigrationProject, AnalysisContext } from "models/api";

import { ErrorWizardContent } from "./error-content";
import { useCancelWizard } from "./useCancelWizard";

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
  enableNext?: boolean;
  disableNavigation?: boolean;
  showErrorContent?: any;
  migrationProject?: MigrationProject;
  analysisContext?: AnalysisContext;
  footer?: React.ReactNode;
  handleOnNextStep?: () => void;
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
  analysisContext,
  showErrorContent,
  children,
  footer,
  handleOnNextStep,
}) => {
  const redirectOnCancel = useCancelWizard();

  const hasApplications =
    migrationProject && migrationProject.applications.length > 0;

  const hasMinData =
    hasApplications &&
    analysisContext &&
    analysisContext.advancedOptions.filter((option) => option.name === "target")
      .length > 0;

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
      canJumpTo: WizardStepIds.ADD_APPLICATIONS <= stepId || hasApplications,
      enableNext: false,
    },
    {
      name: "Configure the analysis",
      steps: [
        {
          id: WizardStepIds.SET_TRANSFORMATION_PATH,
          name: "Set transformation target",
          component: undefined,
          canJumpTo:
            WizardStepIds.SET_TRANSFORMATION_PATH <= stepId || hasMinData,
          enableNext: false,
        },
        {
          id: WizardStepIds.SELECT_PACKAGES,
          name: "Select packages",
          canJumpTo: WizardStepIds.SELECT_PACKAGES <= stepId || hasMinData,
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
          canJumpTo: WizardStepIds.CUSTOM_RULES <= stepId || hasMinData,
          enableNext: false,
        },
        {
          id: WizardStepIds.CUSTOM_LABELS,
          name: "Custom labels",
          canJumpTo: WizardStepIds.CUSTOM_LABELS <= stepId || hasMinData,
          enableNext: false,
        },
        {
          id: WizardStepIds.ADVANCED_OPTIONS,
          name: "Options",
          canJumpTo: WizardStepIds.ADVANCED_OPTIONS <= stepId || hasMinData,
          enableNext: false,
        },
      ],
    },
    {
      id: WizardStepIds.REVIEW,
      name: "Review",
      component: undefined,
      canJumpTo: WizardStepIds.REVIEW <= stepId || hasMinData,
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
    redirectOnCancel(push, migrationProject);
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
      case WizardStepIds.REVIEW:
        push(
          formatPath(Paths.newProject_review, {
            project: migrationProject?.id,
          })
        );
        break;
      default:
        new Error("Can not go to step id[" + newStep.id + "]");
    }
  };

  return (
    <Wizard
      title={isWizard ? "Create project" : undefined}
      description={
        isWizard ? "Create a project for your applications." : undefined
      }
      isOpen={isWizard ? isWizard : undefined}
      steps={!disableNavigation ? wizardSteps : disableWizardSteps(wizardSteps)}
      startAtStep={stepId}
      onNext={handleOnNextStep}
      onBack={handleOnGoToStep}
      onGoToStep={handleOnGoToStep}
      onClose={handleOnClose}
      navAriaLabel="Create project steps"
      mainAriaLabel="Create project content"
      footer={
        footer ? (
          footer
        ) : (
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
        )
      }
    />
  );
};
