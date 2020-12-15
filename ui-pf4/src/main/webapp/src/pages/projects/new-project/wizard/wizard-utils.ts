import { AdvancedOptionsFieldKey } from "Constants";
import { AnalysisContext, MigrationProject } from "models/api";
import { Paths } from "Paths";

import { NewProjectWizardStepIds } from "./project-wizard";

export const getMaxAllowedStepToJumpTo = (
  project?: MigrationProject,
  analysisContext?: AnalysisContext
) => {
  const projectHasApplications = project && project.applications.length > 0;
  const projectHasTargetDefined =
    analysisContext &&
    analysisContext.advancedOptions.filter(
      (option) => option.name === AdvancedOptionsFieldKey.TARGET
    ).length > 0;
  const projectHasIncludedPackages =
    analysisContext && analysisContext.includePackages.length > 0;

  let canJumpTo: NewProjectWizardStepIds = NewProjectWizardStepIds.DETAILS;
  if (projectHasApplications) {
    canJumpTo = NewProjectWizardStepIds.ADD_APPLICATIONS;
  }
  if (projectHasTargetDefined) {
    canJumpTo = NewProjectWizardStepIds.SET_TRANSFORMATION_PATH;
  }
  if (projectHasIncludedPackages) {
    canJumpTo = NewProjectWizardStepIds.REVIEW;
  }

  return canJumpTo;
};

export const getPathFromStep = (step: NewProjectWizardStepIds) => {
  switch (step) {
    case NewProjectWizardStepIds.DETAILS:
      return Paths.newProject_details;
    case NewProjectWizardStepIds.ADD_APPLICATIONS:
      return Paths.newProject_addApplications;
    case NewProjectWizardStepIds.SET_TRANSFORMATION_PATH:
      return Paths.newProject_setTransformationPath;
    case NewProjectWizardStepIds.SELECT_PACKAGES:
      return Paths.newProject_selectPackages;
    case NewProjectWizardStepIds.CUSTOM_RULES:
      return Paths.newProject_customRules;
    case NewProjectWizardStepIds.CUSTOM_LABELS:
      return Paths.newProject_customLabels;
    case NewProjectWizardStepIds.ADVANCED_OPTIONS:
      return Paths.newProject_advandedOptions;
    case NewProjectWizardStepIds.REVIEW:
      return Paths.newProject_review;
  }
};
