import React from "react";
import { Wizard, WizardStep } from "@patternfly/react-core";
import { ErrorWizardContent } from "./error-content";
import { LoadingWizardContent } from "./loading-content";

export enum NewProjectWizardStepIds {
  DETAILS = 1,
  ADD_APPLICATIONS = 2,
  SET_TRANSFORMATION_PATH = 3,
  SELECT_PACKAGES = 4,
  CUSTOM_RULES = 5,
  CUSTOM_LABELS = 6,
  ADVANCED_OPTIONS = 7,
  REVIEW = 8,
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

const getWizardStepId = (id: string | number | undefined) => {
  switch (id) {
    case NewProjectWizardStepIds.DETAILS:
      return NewProjectWizardStepIds.DETAILS;
    case NewProjectWizardStepIds.ADD_APPLICATIONS:
      return NewProjectWizardStepIds.ADD_APPLICATIONS;
    case NewProjectWizardStepIds.SET_TRANSFORMATION_PATH:
      return NewProjectWizardStepIds.SET_TRANSFORMATION_PATH;
    case NewProjectWizardStepIds.SELECT_PACKAGES:
      return NewProjectWizardStepIds.SELECT_PACKAGES;
    case NewProjectWizardStepIds.CUSTOM_RULES:
      return NewProjectWizardStepIds.CUSTOM_RULES;
    case NewProjectWizardStepIds.CUSTOM_LABELS:
      return NewProjectWizardStepIds.CUSTOM_LABELS;
    case NewProjectWizardStepIds.ADVANCED_OPTIONS:
      return NewProjectWizardStepIds.ADVANCED_OPTIONS;
    case NewProjectWizardStepIds.REVIEW:
      return NewProjectWizardStepIds.REVIEW;
  }
};

export interface NewProjectWizardProps {
  stepId: NewProjectWizardStepIds;
  canJumpUpTo: NewProjectWizardStepIds;
  disableNav?: boolean;
  showErrorContent?: any;
  footer: React.ReactNode;
  onGoToStep: (
    newStep: NewProjectWizardStepIds,
    prevStep: NewProjectWizardStepIds
  ) => void;
}

export const NewProjectWizard: React.FC<NewProjectWizardProps> = ({
  stepId,
  canJumpUpTo,
  disableNav,
  showErrorContent,
  children,
  footer,
  onGoToStep,
}) => {
  const handleOnGoToStep = (
    newStep: { id?: string | number; name: React.ReactNode },
    prevStep: { prevId?: string | number; prevName: React.ReactNode }
  ) => {
    if (newStep.id === prevStep.prevId) {
      return;
    }

    const next = getWizardStepId(newStep.id);
    const prev = getWizardStepId(prevStep.prevId);
    if (!next || !prev) {
      throw new Error("Could not infer StepId");
    }

    onGoToStep(next, prev);
  };

  const wizardSteps: WizardStep[] = [
    {
      id: NewProjectWizardStepIds.DETAILS,
      name: "Details",
      canJumpTo: NewProjectWizardStepIds.DETAILS <= canJumpUpTo,
      enableNext: false,
      component: <LoadingWizardContent />,
    },
    {
      id: NewProjectWizardStepIds.ADD_APPLICATIONS,
      name: "Add applications",
      canJumpTo: NewProjectWizardStepIds.ADD_APPLICATIONS <= canJumpUpTo,
      enableNext: false,
      component: <LoadingWizardContent />,
    },
    {
      name: "Configure the analysis",
      steps: [
        {
          id: NewProjectWizardStepIds.SET_TRANSFORMATION_PATH,
          name: "Set transformation target",
          canJumpTo:
            NewProjectWizardStepIds.SET_TRANSFORMATION_PATH <= canJumpUpTo,
          enableNext: false,
          component: <LoadingWizardContent />,
        },
        {
          id: NewProjectWizardStepIds.SELECT_PACKAGES,
          name: "Select packages",
          canJumpTo: NewProjectWizardStepIds.SELECT_PACKAGES <= canJumpUpTo,
          enableNext: false,
          component: <LoadingWizardContent />,
        },
      ],
    },
    {
      name: "Advanced",
      steps: [
        {
          id: NewProjectWizardStepIds.CUSTOM_RULES,
          name: "Custom rules",
          canJumpTo: NewProjectWizardStepIds.CUSTOM_RULES <= canJumpUpTo,
          enableNext: false,
          component: <LoadingWizardContent />,
        },
        {
          id: NewProjectWizardStepIds.CUSTOM_LABELS,
          name: "Custom labels",
          canJumpTo: NewProjectWizardStepIds.CUSTOM_LABELS <= canJumpUpTo,
          enableNext: false,
          component: <LoadingWizardContent />,
        },
        {
          id: NewProjectWizardStepIds.ADVANCED_OPTIONS,
          name: "Options",
          canJumpTo: NewProjectWizardStepIds.ADVANCED_OPTIONS <= canJumpUpTo,
          enableNext: false,
          component: <LoadingWizardContent />,
        },
      ],
    },
    {
      id: NewProjectWizardStepIds.REVIEW,
      name: "Review",
      canJumpTo: NewProjectWizardStepIds.REVIEW <= canJumpUpTo,
      enableNext: false,
      component: <LoadingWizardContent />,
    },
  ];

  let selectedStep: WizardStep;

  switch (stepId) {
    case NewProjectWizardStepIds.DETAILS:
      selectedStep = wizardSteps[0];
      break;
    case NewProjectWizardStepIds.ADD_APPLICATIONS:
      selectedStep = wizardSteps[1];
      break;
    case NewProjectWizardStepIds.SET_TRANSFORMATION_PATH:
      selectedStep = wizardSteps[2].steps![0];
      break;
    case NewProjectWizardStepIds.SELECT_PACKAGES:
      selectedStep = wizardSteps[2].steps![1];
      break;
    case NewProjectWizardStepIds.CUSTOM_RULES:
      selectedStep = wizardSteps[3].steps![0];
      break;
    case NewProjectWizardStepIds.CUSTOM_LABELS:
      selectedStep = wizardSteps[3].steps![1];
      break;
    case NewProjectWizardStepIds.ADVANCED_OPTIONS:
      selectedStep = wizardSteps[3].steps![2];
      break;
    case NewProjectWizardStepIds.REVIEW:
      selectedStep = wizardSteps[4];
      break;
  }

  selectedStep.canJumpTo = true;
  selectedStep.component = children;

  //

  if (showErrorContent) {
    selectedStep.component = <ErrorWizardContent />;
  }

  return (
    <Wizard
      navAriaLabel="Create project steps"
      mainAriaLabel="Create project content"
      steps={disableNav ? disableWizardSteps(wizardSteps) : wizardSteps}
      startAtStep={stepId}
      onGoToStep={handleOnGoToStep}
      footer={footer}
    />
  );
};
